from gali.processes.process import Process

class Game():
	"""Base class reprensenting a game"""

	process_class: type[Process] = None

	name: str = None
	platform: str = None
	is_installed: bool = True

	image_box_art: str = None
	image_banner: str = None
	image_icon: str = None

	def __init__(self, name) -> None:
		self.name = name

	def __str__(self) -> str:
		return self.name