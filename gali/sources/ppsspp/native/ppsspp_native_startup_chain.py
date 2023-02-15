from gali.sources.ppsspp.abc_ppsspp_startup_chain import ABCPPSSPPStartupChain


class PPSSPPNativeStartupChain(ABCPPSSPPStartupChain):

    name = "PPSSPP SDL frontend"
    stem = ["PPSSPPSDL"]