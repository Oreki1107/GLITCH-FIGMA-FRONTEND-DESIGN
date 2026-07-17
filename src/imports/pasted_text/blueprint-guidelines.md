Read glitch-blueprint.md completely before making any modifications.

Treat the blueprint as the single source of truth.

The current prototype has successfully established the visual identity of Glitch.

The typography, overall visual language, spacing philosophy, component style, and mobile-first direction have been approved.

This iteration is NOT a redesign.

Do NOT redesign the interface.

Do NOT replace the current visual language.

Do NOT create a different artistic direction.

Instead, evolve the existing prototype into a scalable, production-ready frontend foundation for a future Headless Shopify storefront.

Think like a Product Architect and Product Designer simultaneously.

Your responsibility is to improve the product architecture through better UI composition, navigation, scalability, and reusable rendering patterns while preserving the approved design language.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRIMARY OBJECTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The current prototype still contains many assumptions based on today's mock content.

Those assumptions must be removed.

The interface should never assume:

• a fixed number of products
• a fixed number of collections
• a fixed number of categories
• predefined category names
• predefined collection names
• predefined homepage sections
• predefined editorial sections
• predefined archive sections
• predefined campaigns

Everything should become adaptable.

Design every screen so that future Shopify data can naturally populate it without requiring redesign.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SHOPIFY-FIRST THINKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Although Shopify is not connected yet, every layout should behave as if data will eventually come from Shopify.

The client may initially have:

• 8 products
• 1 collection
• 2 categories

Six months later they may have:

• 400 products
• 25 collections
• 30 categories
• multiple campaigns
• seasonal drops
• archived collections

The interface should gracefully support both situations.

No redesign should ever be required because the catalogue grows or shrinks.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REMOVE HARDCODED ASSUMPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Do not design around today's mock data.

Do not hardcode navigation around temporary categories.

Do not create fictional collection names.

Do not invent categories simply to fill empty space.

The brand owner controls:

• category names
• collection names
• featured collections
• homepage highlights
• campaigns
• announcements

The UI should simply provide flexible layouts capable of rendering whatever Shopify eventually provides.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DYNAMIC RENDERING PHILOSOPHY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every repeated content area should behave like a reusable rendering pattern.

Instead of assuming specific content, create layouts capable of adapting to changing data.

Examples include:

Collections

Categories

Featured Products

New Arrivals

Editorial Features

Product Carousels

Recommendations

Campaign Banners

Archive

Lookbook

Every section should gracefully support:

• zero items
• one item
• many items

without breaking composition.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPTIONAL CONTENT PHILOSOPHY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Not every brand will have every type of content.

Design the prototype so optional sections naturally appear or disappear depending on available data.

Examples include:

Archive

Lookbook

Editorial

Campaign

Trending

Recently Viewed

Community Picks

Continue Shopping

Recommendations

If Shopify eventually provides no data for these sections, the layout should remain balanced.

Avoid creating visual gaps.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOMEPAGE STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Do not think of the homepage as a fixed page.

Think of it as a collection of reusable content modules.

The homepage should be capable of expanding and shrinking naturally.

The order of sections should remain flexible.

Future engineering should be able to reorder homepage modules without redesigning layouts.

Expand the homepage where appropriate, but do not introduce meaningless filler content.

Prioritize shopping flow.

Prioritize discovery.

Prioritize browsing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COLLECTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Collections should never assume names.

Collections should never assume quantity.

Collections should never assume layout.

Design collection browsing so it naturally supports:

One collection

Several collections

Many collections

The experience should remain clean regardless of catalogue size.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Categories should behave the same way.

The client may rename categories at any time.

The client may delete categories.

The client may add categories.

The interface should never require redesign because category names change.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCT DISCOVERY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Improve the shopping journey.

Products should be discoverable through multiple pathways.

However, every discovery surface should remain reusable.

Avoid one-off layouts.

Avoid sections that only work for today's mock data.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NAVIGATION AUDIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Perform a complete navigation review.

The current navigation is inconsistent and confusing.

Review every navigation path.

Review every page transition.

Review every entry point.

Review every exit point.

Every page should always answer:

Where am I?

How do I go back?

Where can I go next?

Simplify navigation wherever possible.

Use a single consistent navigation philosophy throughout the application.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UNIVERSAL BACK NAVIGATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Introduce one consistent Back navigation pattern.

Every secondary page should use the same interaction.

Users should never become trapped inside Archive, Editorial, Collections or Product pages.

Navigation confidence is more important than visual experimentation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INDEX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Treat Index as the primary exploration hub.

Keep it simple.

Reduce typography weight.

Increase spacing.

Improve readability.

Improve touch ergonomics.

Keep only high-level destinations.

Avoid overwhelming the user.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEARCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rename Scan to Search.

Search should become the universal discovery entry point.

Future engineering will connect Shopify Search.

Design the layout accordingly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCT CARDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Preserve the current visual style.

Do not redesign product cards.

Remove interface elements that conflict with the planned gesture-based interaction system.

Inline "+" buttons should not exist.

Inline Wishlist buttons should not exist.

Instead, prepare product cards for future engineering.

Design an expanded visual state representing the future Long Press interaction.

This state should reveal:

• price

• available colours

• ratings

• quick specifications

Do not implement gestures.

Only prepare the visual state.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSIVE PHILOSOPHY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Continue designing mobile-first.

Desktop should become an expanded composition.

Never stretch mobile layouts.

Desktop should reveal more content rather than larger content.

Review every horizontal section.

Review every carousel.

Review every responsive breakpoint.

Ensure layouts remain elegant regardless of content quantity.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROTOTYPE COMPLETENESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every visible interactive element should perform its expected behaviour.

Review:

Buttons

Tabs

Navigation

Arrows

Carousels

Collection selectors

Category selectors

Footer links

Product links

Search entry

Wishlist

Inventory

Fix broken prototype wiring.

Remove dead interactions.

Do not leave decorative controls that perform no action.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN CONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Perform a complete consistency audit before finishing.

Review:

Typography

Spacing

Margins

Padding

Component sizing

Photography

Grid rhythm

Section rhythm

Visual hierarchy

Touch targets

Navigation patterns

Every page should feel like part of one unified design system.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL OBJECTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Do not redesign the application.

Do not create a new visual identity.

Do not simplify the experience.

Instead, transform the current prototype into a scalable, data-driven, Shopify-ready frontend foundation that can gracefully support both a startup fashion brand with very few products and a mature fashion brand with hundreds of products without requiring future layout redesigns.

Preserve the approved Glitch identity while eliminating hardcoded assumptions, improving navigation, strengthening product discovery, and making every major UI pattern reusable and adaptable for future Shopify integration.