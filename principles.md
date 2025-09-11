# Code Review Principles

*Core principles extracted from code reviewer feedback to maintain consistent code quality standards*

## 1. DRY Principle (Don't Repeat Yourself)
- **Never duplicate code across files** - Extract shared logic into reusable utilities
- **Consolidate identical code blocks** - If two pieces of code do the same thing, they should be one piece of code
- **Single source of truth** - Business logic, configuration, and error handling should have one authoritative location
- **Question repeated patterns** - If you're copying and pasting code, create a shared function instead

## 2. Production Code Standards
- **No development logging in production** - Remove all `console.log`, `console.error` statements before merging
- **No dead code** - Remove unused variables, functions, and conditional blocks that never execute
- **Clean up temporary code** - Remove debugging statements, commented code, and experimental features
- **Professional codebase** - Code should look production-ready, not development-in-progress

## 3. User Experience First
- **Don't artificially limit functionality** - If users expect to interact with something, they should be able to
- **Consistent interaction patterns** - Similar elements should behave similarly across the application
- **Question arbitrary restrictions** - Ask "why can't users do X?" before implementing limitations

## 4. Component Design Principles
- **Leverage existing patterns** - Use established `className` props instead of hardcoding styles
- **Maintain component flexibility** - Don't make components less reusable by baking in specific styling
- **Respect component boundaries** - Core/shared components should remain generic and composable
- **Follow established conventions** - If the codebase has patterns, follow them consistently

## 5. Configuration & Environment Management
- **Single environment variable per concept** - Don't use multiple env vars for the same configuration
- **Clear naming conventions** - Environment variables should be self-documenting
- **Avoid configuration confusion** - Developers should know exactly which variables to set
- **Document configuration requirements** - Make setup clear and unambiguous

## 6. Code Complexity & Abstraction
- **Don't abstract prematurely** - Simple conditionals are better than unnecessary abstractions for single use cases
- **Question over-engineering** - Ask if the complexity is justified by the requirements
- **Prefer explicit over implicit** - Code should be clear about what it's doing and why
- **YAGNI (You Aren't Gonna Need It)** - Don't build for hypothetical future needs

## 7. Import & Dependency Management
- **Use static imports when possible** - Dynamic imports should have clear justification
- **Document import decisions** - If dynamic imports are necessary, explain why
- **Consistent import patterns** - Follow the same import style throughout the codebase
- **Question unnecessary async** - Don't make functions async unless they need to be

## 8. Architectural Consistency
- **Maintain consistent patterns** - If the codebase has established ways of doing things, follow them
- **Question scope creep** - Changes should be related to the stated purpose of the PR
- **Separate concerns** - Different types of changes should be in different commits/PRs
- **Think about maintainability** - Code should be easy to understand and modify later

## 9. Error Handling & Robustness
- **Centralize error handling** - Don't duplicate error message mapping and handling logic
- **Consistent error messages** - Users should see consistent messaging across similar scenarios
- **Handle edge cases** - Consider what happens when things go wrong
- **Graceful degradation** - Systems should handle failures elegantly

## 10. Performance & Efficiency
- **Question unnecessary overhead** - Don't add complexity without performance benefit
- **Remove unused code paths** - Dead code still has maintenance cost
- **Optimize for the common case** - Don't over-optimize for edge cases
- **Consider bundle size** - Unnecessary dependencies and code increase load times

## Review Checklist

Before opening a PR, ask these questions:

### DRY & Duplication
- [ ] Am I duplicating any existing code?
- [ ] Could this logic be shared with other parts of the codebase?
- [ ] Is there already a utility/helper that does this?

### Production Readiness
- [ ] Have I removed all console.log statements?
- [ ] Is there any dead/unreachable code?
- [ ] Are there any TODO comments or temporary fixes?

### User Experience
- [ ] Does this artificially limit what users can do?
- [ ] Is the behavior consistent with similar features?
- [ ] Would this confuse or frustrate users?

### Code Quality
- [ ] Am I following existing patterns in the codebase?
- [ ] Is this the simplest solution that meets the requirements?
- [ ] Will this be easy for other developers to understand?

### Configuration & Setup
- [ ] Are environment variables clearly named and documented?
- [ ] Am I using existing configuration patterns?
- [ ] Will this be easy to deploy and configure?

### Architecture & Maintainability
- [ ] Does this fit well with the existing architecture?
- [ ] Will this be easy to modify or extend later?
- [ ] Am I separating concerns appropriately?

---

*These principles should be applied during development and self-review before submitting PRs. They represent the lens through which code reviews are conducted.*
