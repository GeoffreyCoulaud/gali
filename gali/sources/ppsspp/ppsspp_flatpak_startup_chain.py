from gali.sources.ppsspp.ppsspp_startup_chain import PPSSPPStartupChain


class PPSSPPFlatpakStartupChain(PPSSPPStartupChain):

    name = "PPSSPP Flatpak"
    stem = ["flatpak", "run", "org.ppsspp.PPSSPP"]