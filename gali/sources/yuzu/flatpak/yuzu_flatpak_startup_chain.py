from gali.sources.yuzu.abc_yuzu_startup_chain import ABCYuzuStartupChain


class YuzuFlatpakStartupChain(ABCYuzuStartupChain):

    name = "Yuzu Flatpak"
    stem = ["flatpak", "run", "org.yuzu_emu.yuzu"]