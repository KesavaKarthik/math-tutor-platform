/**
 * Presentation-only class bundles. Components stay dumb about colour and
 * spacing; pages pick a theme and pass it down.
 *
 * Every value must be a complete, literal Tailwind class string so the JIT
 * compiler can see it — never build these by interpolation.
 */
export interface ChatTheme {
  /** Layout of a message bubble (padding, radius, font size). */
  bubble: string;
  userBubble: string;
  aiBubble: string;
  typingBubble: string;
  typingDot: string;
  composer: string;
  composerInput: string;
  composerButton: string;
  composerIcon: string;
}

/** Look of one of the two mode cards on the chapter screen. */
export interface ModeCardTheme {
  card: string;
  iconWrapper: string;
  icon: string;
}

/** Everything that differentiates Learning Mode from Socratic Mode. */
export interface StudyModeConfig {
  title: string;
  titleClassName: string;
  progressClassName: string;
  spinnerClassName: string;
  nextButtonClassName: string;
  /** Label of the advance button while there are still steps left. */
  nextLabel: string;
  /** Label of the advance button on the final step. */
  finishLabel: string;
  /** Heading shown when the chapter has no material for this mode. */
  emptyTitle: string;
  chatPlaceholder: string;
  chatTheme: ChatTheme;
}
