from pathlib import Path
p = Path('tests/munchpal.spec.ts')
s = p.read_text(encoding='utf-8-sig').replace('109 of 110 prototype tasks completed', 'What testing showed')
s = s.replace('const results = page.getByRole("table", { name: "Task completion by participant group" });', 'const results = page.locator(\'dl[aria-labelledby="munchpal-results-caption"]\');')
s = s.replace('await expect(results.getByRole("row", { name: /Residents/ })).toContainText("59 of 60");', 'await expect(results.getByRole("definition").first()).toContainText("59 of 60");')
s = s.replace('await expect(results.getByRole("row", { name: /Garda Pangan volunteers/ })).toContainText("50 of 50");', 'await expect(results.getByRole("definition").last()).toContainText("50 of 50");\n  expect(copy).toContain("109 of 110 task attempts");')
p.write_text(s, encoding='utf-8')
