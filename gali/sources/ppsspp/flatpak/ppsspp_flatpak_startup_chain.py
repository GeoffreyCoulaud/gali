from gali.sources.ppsspp.abc_ppsspp_startup_chain import ABCPPSSPPStartupChain


class PPSSPPFlatpakStartupChain(ABCPPSSPPStartupChain):

    name = "PPSSPP Flatpak"
    stem = ["flatpak", "run", "org.ppsspp.PPSSPP"]