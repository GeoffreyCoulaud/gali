from gali.sources.ppsspp.native.ppsspp_native_startup_chain import PPSSPPNativeStartupChain
from gali.sources.ppsspp.abc_ppsspp_game import ABCPPSSPPGame


class PPSSPPFlatpakStartupChain(PPSSPPNativeStartupChain):

    game: ABCPPSSPPGame
    name = "PPSSPP Flatpak"
    stem = ["flatpak", "run", "org.ppsspp.PPSSPP"]