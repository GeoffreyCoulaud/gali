from math import inf
from pathlib import PurePath

from gali.utils.explicit_config_parser import ExplicitConfigParser
from gali.utils.locations import HOME
from gali.sources.emulation_source import EmulationSource
from gali.sources.game_dir import GameDir
from gali.sources.yuzu.native.yuzu_native_game import YuzuNativeGame
from gali.sources.file_dependent_scannable import FileDependentScannable


class YuzuNativeSource(EmulationSource, FileDependentScannable):

    name: str = "Yuzu"
    game_class: type[YuzuNativeGame] = YuzuNativeGame
    config_path: str = f"{HOME}/.config/yuzu/qt-config.ini"
    rom_extensions: tuple[str] = (".xci", ".nsp", ".nso", ".nro")

    def get_config(self) -> ExplicitConfigParser:
        config = ExplicitConfigParser()
        config.read(self.config_path, encoding="utf-8-sig")
        return config

    def get_rom_dirs(self, config: ExplicitConfigParser) -> tuple[GameDir]:
        rom_dirs = []
        n_dirs = config.getint(
            "UI",
            r"Paths\gamedirs\size",
            fallback=0
        )
        for i in range(1, n_dirs + 1):
            deep = config.getboolean(
                "UI",
                f"Paths\\gamedirs\\{i}\\deep_scan",
                fallback=False
            )
            path = config.get(
                "UI",
                f"Paths\\gamedirs\\{i}\\path",
                fallback=None
            )
            if path is None:
                continue
            if path in ("SDMC", "UserNAND", "SysNAND"):
                continue
            depth = inf if deep else 0
            rom_dirs.append(GameDir(path, depth))
        return tuple(rom_dirs)

    def get_rom_games(self, rom_dirs: tuple[GameDir]) -> tuple[YuzuNativeGame]:
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

    def scan(self) -> tuple[YuzuNativeGame]:
        config = self.get_config()
        rom_dirs = self.get_rom_dirs(config)
        rom_games = self.get_rom_games(rom_dirs)
        return rom_games

    def get_precondition_file_path(self):
        return self.config_path
