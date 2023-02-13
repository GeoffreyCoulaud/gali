import re
import shlex

from gali.sources.shell_command_startup_chain import ShellCommandStartupChain


class DesktopStartupChain(ShellCommandStartupChain):

    def get_start_command(self, game, **kwargs) -> tuple[str]:
        def filter_fn(string: str):
            unwanted = re.compile("%[fFuUdDnNickvm]")
            return unwanted.fullmatch(string) is None
        split_exec = shlex.split(game.exec_str)
        args = tuple(filter(filter_fn, split_exec))
        return args