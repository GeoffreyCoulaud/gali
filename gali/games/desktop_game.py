import re
import shlex
from dataclasses import dataclass, field

from gali.games.game import Game

@dataclass
class DesktopGame(Game):

	platform: str = field(default="PC", init=False)
	is_installed: bool = field(default=True, init=False)
	exec_str: str = field(default=None)

	def get_start_command(self, **kwargs) -> tuple[str]:
		split_exec = shlex.split(self.exec_str)
		unwanted = re.compile("%[fFuUdDnNickvm]")
		predicate = lambda s: (unwanted.fullmatch(s)) is None
		args = tuple(filter(predicate, split_exec))
		return args