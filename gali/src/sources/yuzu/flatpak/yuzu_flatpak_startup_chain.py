from gali.sources.yuzu.yuzu_startup_chain import YuzuStartupChain


class YuzuFlatpakStartupChain(YuzuStartupChain):

    name = "Yuzu Flatpak"
    stem = ["flatpak", "run", "org.yuzu_emu.yuzu"]