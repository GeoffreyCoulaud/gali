from gali.sources.citra.abc_citra_startup_chain import ABCCitraStartupChain


class CitraFlatpakStartupChain(ABCCitraStartupChain):

    name = "Citra Flatpak"
    stem = ["flatpak", "run", "org.citra_emu.citra"]