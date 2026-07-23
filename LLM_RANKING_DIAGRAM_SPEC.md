# LLM Ranking 3D Ziggurat Diagram Specification

This document maps the data structure of the Kairma LLM Rankings table (left side) to the visual structure of the 3D Isometric Ziggurat/Pyramid Diagram (right side). Use this specification to construct or design the interactive isometric vector diagram.

## 1. Overall Structure (The Ziggurat)
The diagram consists of a clean, minimal 3-tiered isometric pyramid structure made of transparent, glassy emerald platforms, stacked vertically. Each terrace represents a specific capability tier of LLMs.

### Tier 1: Top Level (Frontier Tier)
* **Data Mapping**: Corresponds to **`FRONTIER`** models in the UI table (e.g., Claude 3.5 Sonnet, OpenAI GPT-4o / GPT-5.6 Sol).
* **Visual Representation**: The highest, smallest square terrace.
* **Nodes (Interactive Buttons)**: Place 2-3 interactive blocks/buttons on this level. Each block must feature the provider's logo (e.g., Anthropic, OpenAI) representing the absolute best models.
* **Color Accent**: Red dot/glow (matching the UI table).

### Tier 2: Middle Level (Specialist Tier)
* **Data Mapping**: Corresponds to **`SPECIALIST`** models in the UI table (e.g., xAI Grok 4.5, Gemini 2.5 Pro, Z.ai GLM 5.2).
* **Visual Representation**: The middle terrace, wider than the top but smaller than the base.
* **Nodes (Interactive Buttons)**: Place 3-5 interactive blocks/buttons featuring their respective provider logos.
* **Color Accent**: Purple / Blue dot/glow (matching the UI table).

### Tier 3: Base Level (Core Tier)
* **Data Mapping**: Corresponds to **`CORE`** models in the UI table (e.g., Llama 3.3 70B, OpenAI GPT-4o Mini, GPT-5.6 Terra).
* **Visual Representation**: The lowest, widest base terrace.
* **Nodes (Interactive Buttons)**: Place multiple interactive blocks/buttons featuring their respective provider logos.
* **Color Accent**: Green dot/glow (matching the UI table).

## 2. Diagram Elements & Interactivity
- **Interactive Logo Blocks**: The obelisks/blocks on the terraces act as interactive buttons. They should clearly display the logo of the model/provider they represent. 
- **Two-Way Binding (Click Interaction)**: When a user clicks or presses a logo block on the pyramid, the diagram triggers an event that filters, highlights, or auto-scrolls to the corresponding model in the detailed data table on the left side of the screen.
- **Core Beam**: A bright, glowing cyan/green energy beam shoots straight up through the center of all three terraces, representing the Kairma Neural Pipeline connecting the models.
- *(Note: Text labels mapping to the tier names have been explicitly removed to keep the vector art clean and minimal).*

## 3. Aesthetic & Styling
- **Theme**: Clean, cybernetic isometric vector art (glassmorphism).
- **Base Color**: Dark void background.
- **Platform Material**: Translucent glass/vector (e.g., `mix-blend-mode: screen` or `lighten` with glowing green edges).
- **Node Material**: Solid blocks that pop against the glass terraces, housing the provider logos.
