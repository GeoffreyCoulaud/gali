class GameDir():

    path: str
    depth: int = 0

    def __init__(self, path, depth) -> None:
        self.path = path
        self.depth = depth
