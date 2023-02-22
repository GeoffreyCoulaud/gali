from gali.sources.citra.citra_startup_chain import CitraStartupChain


class CitraFlatpakStartupChain(CitraStartupChain):

    name = "Citra Flatpak"
    stem = ["flatpak", "run", "org.citra_emu.citra"]