from gali.sources.citra.abc_citra_startup_chain import ABCCitraStartupChain


class CitraNativeStartupChain(ABCCitraStartupChain):

    name = "Citra"
    stem = ["citra-qt"]