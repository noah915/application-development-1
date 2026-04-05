What problems does raw SQL create in large applications?
- Repeated query strings increase risk of bugs and SQL injection if not parameterized.
- It leads to a lot of boilerplate mapping between rows and app objects, and harder maintenance as table structures evolve.
- It makes transaction management, migrations, and reuse of logic more error-prone.

What is an ORM in your own words?
- An ORM (Object Relational Mapper) is a library that maps database tables to programming language objects and lets developers query/update using familiar methods instead of raw SQL.

What does an ORM replace or simplify?
- It replaces manual SQL string construction, result row parsing, and data type conversion.
- It simplifies CRUD logic, relationships, and often includes utilities for migrations and validation.

When would you NOT want to use an ORM?
- When you need highly tuned SQL queries for performance or use complex, DB-specific features.
- When simple or small apps are easier to reason in raw SQL, or when team has strong SQL expertise and wants full control.
