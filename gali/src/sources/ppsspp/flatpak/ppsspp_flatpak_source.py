from gali.sources.ppsspp.flatpak.ppsspp_flatpak_game import PPSSPPFlatpakGame
from gali.sources.ppsspp.ppsspp_source import PPSSPPSource
from gali.utils.locations import HOME


class PPSSPPFlatpakSource(PPSSPPSource):

    name: str = "PPSSPP (Flatpak)"
    game_class: type[PPSSPPFlatpakGame] = PPSSPPFlatpakGame
    config_path: str = f"{HOME}/.var/app/org.ppsspp.PPSSPP/config/ppsspp/PSP/SYSTEM/ppsspp.ini"