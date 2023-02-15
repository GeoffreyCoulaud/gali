from gali.sources.retroarch.abc_retroarch_game import ABCRetroarchGame
from gali.sources.retroarch.native.retroarch_native_startup_chain import RetroarchNativeStartupChain

# TODO decouple from native startup chain (common parts in ABC)
class RetroarchFlatpakStartupChain(RetroarchNativeStartupChain):

    game: ABCRetroarchGame
    name = "Retroarch Flatpak"
    stem = ["flatpak", "run", "org.libretro.RetroArch", "--libretro"]