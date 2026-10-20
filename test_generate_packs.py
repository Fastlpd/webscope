import csv
import tempfile
import unittest
from pathlib import Path

from generate_packs import has_real_source, make_pack, passes_evidence_gate


class GeneratorTests(unittest.TestCase):
    def test_placeholder_source_fails_gate(self):
        idea = {"sources": "REPLACE_WITH_VERIFIED_SOURCE", "evidence_status": "verified", "rights_status": "cleared"}
        self.assertFalse(has_real_source(idea))
        self.assertFalse(passes_evidence_gate(idea))

    def test_real_source_and_statuses_pass_gate(self):
        idea = {"sources": "https://example.org/pet-care", "evidence_status": "verified", "rights_status": "cleared"}
        self.assertTrue(passes_evidence_gate(idea))

    def test_pack_contains_all_review_files(self):
        idea = {"title": "Test Topic", "audience_problem": "A test problem", "angle": "A simple angle", "sources": "", "evidence_status": "needs_review", "rights_status": "needs_review"}
        with tempfile.TemporaryDirectory() as temp:
            folder = make_pack(idea, 1, Path(temp))
            for name in ("research.md", "script.md", "storyboard.md", "metadata.md", "approval.md"):
                self.assertTrue((folder / name).is_file(), name)
            self.assertIn("BLOCKED_PENDING_RESEARCH_REVIEW", (folder / "approval.md").read_text())


if __name__ == "__main__":
    unittest.main()
