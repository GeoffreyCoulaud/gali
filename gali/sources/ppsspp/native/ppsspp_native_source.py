from gali.sources.ppsspp.ppsspp_source import PPSSPPSource
from gali.sources.ppsspp.native.ppsspp_native_game import PPSSPPNativeGame
from gali.utils.locations import HOME


class PPSSPPNativeSource(PPSSPPSource):

    name: str = "PPSSPP"
    game_class: type[PPSSPPNativeGame] = PPSSPPNativeGame
    config_path: str = f"{HOME}/.config/ppsspp/PSP/SYSTEM/ppsspp.ini"