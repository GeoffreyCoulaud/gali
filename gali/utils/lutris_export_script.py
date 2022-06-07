from subprocess import run

from gali.utils.sandbox import is_flatpak # pylint: disable=import-error

def lutris_export_script(game_slug: str, script_path: str) -> None:
    """Export a lutris game's script to a file path"""

    # Build command
    args = []
    if is_flatpak():
        args.extend(["flatpak-spawn", "--host"])
    args.extend(["lutris", game_slug, "--output-script", script_path])

    # Run command (can raise an error)
    run(args, check=True)
