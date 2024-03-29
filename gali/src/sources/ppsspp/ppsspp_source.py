from pathlib import PurePath

from gali.utils.explicit_config_parser import ExplicitConfigParser
from gali.sources.emulation_source import EmulationSource
from gali.sources.game_dir import GameDir
from gali.sources.ppsspp.ppsspp_game import PPSSPPGame
from gali.sources.file_dependent_source import FileDependentSource


class PPSSPPSource(EmulationSource, FileDependentSource):

    name: str
    config_path: str
    game_class: type[PPSSPPGame]
    
    rom_extensions: tuple[str] = (".iso", ".cso")

    def get_config(self) -> ExplicitConfigParser:
        config = ExplicitConfigParser()
        config.read(self.config_path, encoding="utf-8-sig")
        return config

    def get_rom_dirs(self, config: ExplicitConfigParser) -> tuple[GameDir]:
        rom_dirs = []
        items = config.items("PinnedPaths")
        for (key, path) in items:
            rom_dirs.append(GameDir(path, 0))
        return tuple(rom_dirs)

    def get_rom_games(self, rom_dirs: tuple[GameDir]) -> tuple[PPSSPPGame]:
        games = []
        for rom_dir in rom_dirs:
            try:
                rom_paths = self.get_rom_paths(rom_dir, self.rom_extensions)
            except OSError:
                continue
            for path in rom_paths:
                name = PurePath(path).name
                game = self.game_class(
                    name=name,
                    game_path=path,
                    is_installed=True,
                )
                games.append(game)
        return tuple(games)

    def scan(self) -> list[PPSSPPGame]:
        config = self.get_config()
        rom_dirs = self.get_rom_dirs(config)
        rom_games = self.get_rom_games(rom_dirs)
        return rom_games

    def get_precondition_file_path(self):
        return self.config_path