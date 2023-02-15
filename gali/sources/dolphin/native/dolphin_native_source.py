from math import inf
from pathlib import PurePath

from gali.utils.explicit_config_parser import ExplicitConfigParser
from gali.utils.locations import HOME
from gali.sources.game_dir import GameDir
from gali.sources.abc_emulation_source import ABCEmulationSource
from gali.sources.dolphin.native.dolphin_native_game import DolphinNativeGame
from gali.sources.abc_file_dependent_scannable import ABCFileDependentScannable


class DolphinNativeSource(ABCEmulationSource, ABCFileDependentScannable):

    name: str = "Dolphin"
    game_class: type[DolphinNativeGame] = DolphinNativeGame
    config_path: str = f"{HOME}/.config/dolphin-emu/Dolphin.ini"
    rom_extensions: tuple[str] = (".ciso", ".iso", ".wbfs", ".gcm", ".gcz")

    def get_config(self) -> ExplicitConfigParser:
        config = ExplicitConfigParser()
        config.read(self.config_path, encoding="utf-8-sig")
        return config

    def get_rom_dirs(self, config: ExplicitConfigParser) -> tuple[GameDir]:
        rom_dirs = []
        n_dirs = config.getint(
            "General",
            "ISOPaths",
            fallback=0
        )
        deep = config.getboolean(
            "General",
            "RecursiveISOPaths",
            fallback=False
        )
        depth = inf if deep else 0
        for i in range(n_dirs):
            path = config.get("General", f"ISOPath{i}", fallback=None)
            if path is None:
                continue
            rom_dirs.append(GameDir(path, depth))
        return tuple(rom_dirs)

    def get_rom_games(self, rom_dirs: tuple[GameDir]) -> tuple[DolphinNativeGame]:
        games = []
        for rom_dir in rom_dirs:
            rom_paths = []
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

    def scan(self) -> tuple[DolphinNativeGame]:
        config = self.get_config()
        rom_dirs = self.get_rom_dirs(config)
        rom_games = self.get_rom_games(rom_dirs)
        return rom_games

    def get_precondition_file_path(self):
        return self.config_path
