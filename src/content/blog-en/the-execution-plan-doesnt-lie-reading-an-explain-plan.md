---
titulo: "The execution plan doesn't lie: reading an EXPLAIN PLAN"
extracto: "Before adding another index: what to look at first, why cost is useless for comparing, and how to read the tree."
categoria: "Oracle"
fecha: "2025-07-15"
minutos: 6
demo: "plan-ejecucion"
es: "el-plan-de-ejecucion-no-miente-leer-un-explain-plan"
cierre: {"titulo": "That query that takes a minute?", "texto": "It's almost never the data volume. I'll look at the real plan and tell you where the time goes before touching a single index.", "accionEtiqueta": "Look at my query"}
---

## 1. The query isn't slow "because there's a lot of data"

That's the default diagnosis and it's almost never the cause. A ten-million-row table can answer in milliseconds with the right index, and a fifty-thousand-row one can take a minute if the plan decides to scan it entirely for every row of another table.

The execution plan tells you which case you have. No guessing needed.

## 2. What to look at first

Not the cost. Cost is a relative estimate, and comparing the cost of two different queries means nothing.

What you look at is the gap between **estimated** and **actual** rows. If the optimizer thinks a step returns 10 rows and it returns 400,000, everything it decided from there is built on a false assumption: it picked a nested loop where a hash join was needed.

### Where that gap comes from

Almost always from stale statistics, from a function applied to the filtered column (`WHERE UPPER(name) = ...` makes the index on `name` useless) or from an implicit type conversion.

## 3. Access paths, from best to worst

`INDEX UNIQUE SCAN`: one row per key. Perfect.

`INDEX RANGE SCAN`: a slice of the index. Good, if the slice is small.

`TABLE ACCESS FULL`: the whole table. **It's not bad in itself**: if you're going to read 60% of the rows, scanning is faster than jumping through the index. It's bad when you were looking for three rows.

`NESTED LOOPS` over a large set: the classic slow query. For every row of the first set, the second set gets hit.

<demo-plan-ejecucion></demo-plan-ejecucion>

## 4. Read it from the inside out

The plan is a tree and execution starts with the most indented operation. That's the first data source; what's above consumes what's below. Reading it top to bottom, like a list, is what makes it hard to understand.

## 5. Conclusion

Before adding an index, look at the real plan. An extra index slows down every write to that table forever, and many times the problem was a function in the `WHERE` clause on a column that already had an index it couldn't use.
