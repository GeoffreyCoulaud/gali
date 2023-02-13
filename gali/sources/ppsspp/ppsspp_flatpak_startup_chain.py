from gali.sources.ppsspp.ppsspp_startup_chain import PPSSPPStartupChain


class PPSSPPFlatpakStartupChain(PPSSPPStartupChain):

    stem = ["flatpak", "run", "org.ppsspp.PPSSPP"]