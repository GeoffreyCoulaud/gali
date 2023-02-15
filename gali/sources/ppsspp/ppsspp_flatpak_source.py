from gali.sources.ppsspp.ppsspp_flatpak_game import PPSSPPFlatpakGame
from gali.sources.ppsspp.ppsspp_native_source import PPSSPPNativeSource
from gali.utils.locations import HOME


class PPSSPPFlatpakSource(PPSSPPNativeSource):

    name: str = "PPSSPP (Flatpak)"
    game_class: type[PPSSPPFlatpakGame] = PPSSPPFlatpakGame
    config_path: str = f"{HOME}/.var/app/org.ppsspp.PPSSPP/config/ppsspp/PSP/SYSTEM/ppsspp.ini"