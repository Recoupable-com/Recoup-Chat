# Recoup Evaluation System

This directory contains our **Braintrust-based evaluation framework** for testing and improving our AI systems.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- Braintrust API key in `.env` file: `BRAINTRUST_API_KEY=your_key_here`

### Running Evaluations

```bash
# Run all evaluation scripts
pnpm eval

# Run specific evaluation
pnpm eval evals/first-week-album-sales.eval.ts

# Or use npx directly with external packages flag
npx braintrust eval --external-packages playwright playwright-core chromium-bidi @browserbasehq/stagehand
```
