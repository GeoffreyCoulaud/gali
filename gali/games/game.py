from dataclasses import dataclass, field

@dataclass
class Game():
	"""Base class representing a game"""

	name          : str  = field(default=None)
	platform      : str  = field(default=None)
	is_installed  : bool = field(default=True)
	image_box_art : str  = field(default=None, compare=False)
	image_banner  : str  = field(default=None, compare=False)
	image_icon    : str  = field(default=None, compare=False)

	def __str__(self) -> str:
		name = self.name.replace("\n", " ")
		return name

	def get_start_command(self, **kwargs) -> tuple[str]:
		"""Get the list of arguments to start the game process"""
		raise NotImplementedError()