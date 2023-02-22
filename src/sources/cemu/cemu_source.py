from gali.sources.cemu.cemu_game import CemuGame
from gali.sources.emulation_source import EmulationSource


class CemuSource(EmulationSource):
    
    game_class: type[CemuGame]
    rom_extensions: tuple[str] = (".wud",".wux",".wad",".iso",".rpx",".elf")