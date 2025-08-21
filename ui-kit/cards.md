---
layout: uikit-single
title: Cards
slug: cards
draft: false
publishDate: 2024-10-10
is_main: true
tags:
  - ui-kit
---


The `VCard` component is a flexible and highly customizable card element built using the ShadCN Vue library ([official documentation](https://www.shadcn-vue.com/docs/components/card.html)).  It provides a structured way to display cards with a header, content, and footer, along with a set of default styles. This component can be easily customized to meet the needs of various UI designs.

This component is composed of several subcomponents, each with a specific role in managing different parts of the accordion:

- **`VCard`**: The root container that wraps the entire card, providing the basic layout and structure.
- **`VCardContent`**:  The content section that holds the body of the card. It is where the main information is displayed.
- **`VCardFooter`**:  The footer section of the card, often used for actions such as buttons or links.
- **`VCardHeader`**:  The header section of the card that usually contains the card's title and can optionally include actions.
- **`VCardTitle`**: Displays the main title of the card, typically found in the header.
- **`VCardDescription`**: Provides additional descriptive content that can be shown or hidden based on the state of the card (e.g., collapsed or expanded).

These components are located in the path: `ui-kit/src/components/Base/VCard`.

## Props
The `VCard` component inherits props from the ShadCN library, which offers flexibility to control various aspects of the accordion's behavior. You can find a complete list of the props in the official [ShadCN documentation](https://www.shadcn-vue.com/docs/components/card.html).

Additionally, the `VCard` component includes a custom prop that is specific to the UiKit integration:

| Prop       | Type                     | Description                                                                 | Default Value |
|------------|--------------------------|-----------------------------------------------------------------------------|---------------|
| `href`     | `String`                 | The URL the card links to when rendered as an anchor (`<a>`).                | `undefined`   |
| `to`       | `String` or `Object`      | The route or URL for navigation when rendered as a Vue Router link.          | `undefined`   |
| `linkIs`   | `String`                 | Specifies the element type for the link (`<a>` or `<router-link>`).          | `'a'`         |
| `variant`  | `String`                 | The variant of the card that determines its style (`'primary'`, `'secondary'`, or `'ghost'`). | `undefined`   |
