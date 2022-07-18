from dataclasses import dataclass, field

from gali.games.game import Game


class UnsupportedFlavorException(Exception):
    pass


@dataclass
class ItchGame(Game):

    platform: str = field(default="PC", init=False)
    caves: list = field(default=None)
    verdict: dict = field(default=None)
    game_id: str = field(default=None)

    # Example verdict structure
    """{
        "basePath": "/home/geoffrey/Jeux/itch/procrabstination",
        "totalSize": 193566920,
        "candidates": [
            {
                "path": "Procrabstination.x86_64",
                "depth": 1,
                "flavor": "linux",
                "arch": "amd64",
                "size": 14720
            }
        ]
    }"""

    def _get_linux_start_command(self, path) -> tuple[str]:
        return (path,)

    def _get_script_start_command(self, path) -> tuple[str]:
        return ("sh", path)

    def _get_jar_start_command(self, path) -> tuple[str]:
        return ("java", "-jar", path)

    def get_start_command(self, **kwargs) -> tuple[str]:

        """
        From http://docs.itch.ovh/butlerd/master/#/?id=verdict-struct

        A Verdict contains a wealth of information on how to “launch” or “open”
        a specific folder.

        From http://docs.itch.ovh/butlerd/master/#/?id=candidate-struct

        A Candidate is a potentially interesting launch target, be it a native
        executable, a Java or Love2D bundle, an HTML index, etc.
        """

        base_path = self.verdict["basePath"]

        # Find right candidate
        candidate_index = 0
        if kwargs.candidate_index is not None:
            candidate_index = kwargs.candidate_index
        candidate = self.verdict["candidates"][candidate_index]

        # Build start command
        exec_path = candidate["path"]
        path = f"{base_path}/{exec_path}"
        flavor = candidate["flavor"]

        # TODO find a way to start HTML games too (needs http server)
        # ? Implement pre-start and post-finish hooks, life cycle wrapper class
        if flavor == "linux":
            return self._get_linux_start_command(path)
        elif flavor == "script":
            return self._get_script_start_command(path)
        elif flavor == "jar":
            return self._get_jar_start_command(path)
        else:
            raise UnsupportedFlavorException(f"Unsupported flavor {flavor}")
