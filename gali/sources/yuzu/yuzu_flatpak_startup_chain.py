from gali.sources.yuzu.yuzu_startup_chain import YuzuStartupChain


class YuzuFlatpakStartupChain(YuzuStartupChain):

    stem = ["flatpak", "run", "org.yuzu_emu.yuzu"]