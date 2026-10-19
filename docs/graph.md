# Knowledge graph maintenance

Reviewed 19 October 2026. [graphify-out/graph.json](../graphify-out/graph.json) is the current graph; [graph.html](../graphify-out/graph.html) is its offline visualization. [GRAPH_REPORT.md](../graphify-out/GRAPH_REPORT.md) is generated from that graph. Dated reports and obsolete session memories are removed during documentation cleanup.

Follow [AGENTS.md](../AGENTS.md): query the graph first for codebase questions, use path/explain for focused relationships, and prefer a scoped result over the broad report. If a generated wiki index exists, use it for navigation. The graph is an index; verify current source before changing code or repeating an old claim.

After code changes run `graphify update .` for the AST update without API-backed extraction. Changes/deletions in documentation also require refreshing their graph entries. The Markdown cleanup replaces old document nodes with deterministic file/heading/link entries from retained files, prunes removed sources, and retains code relationships. This indexes current text without inventing semantic evidence or paying for extraction.

Keep graph IDs unique, edge endpoints valid, and local source paths present. Refresh the report and lessons after graph changes. The HTML viewer must retain its pinned [local vis-network library](../graphify-out/vendor/vis-network.min.js) rather than depending on the generated template's external CDN script.

Generated reports/lessons describe the current graph, not product requirements. [The documentation index](README.md) owns navigation to maintained requirements, behavior, and evidence records.
