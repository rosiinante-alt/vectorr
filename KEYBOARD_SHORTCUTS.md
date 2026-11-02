# Keyboard Shortcuts

Vectorr supports keyboard navigation to improve accessibility and workflow efficiency. All shortcuts work globally across the app but respect when you're typing in a text input.

## Navigation & Canvas

| Shortcut | Action |
|----------|--------|
| **Space** | Hold to activate pan mode; drag your mouse to move around the canvas |
| **+** | Zoom in (works in canvas or globally) |
| **−** | Zoom out (works in canvas or globally) |
| **0** | Reset zoom level to 100% |

## General

| Shortcut | Action |
|----------|--------|
| **?** | Show this keyboard shortcuts guide |
| **Escape** | Close the keyboard shortcuts modal |

## Implementation Details

### Focus Handling

- Keyboard shortcuts are **globally available** throughout the app
- Shortcuts are **ignored when typing in text inputs** (e.g., file names, search boxes)
- The following shortcuts work even in text inputs: `?`, `Escape`

### Canvas Interactions

- The canvas supports both mouse dragging and spacebar-based panning
- Zoom controls can be triggered via keyboard (+/−) or the UI buttons
- The zoom level is constrained between 25% (0.25x) and 800% (8x)

### Accessibility

- All shortcuts are keyboard-accessible without a mouse
- The shortcuts modal is fully keyboard navigable
- Press Tab to move between shortcuts and the close button
- Press Enter or Space to activate buttons

## Future Enhancements

Planned shortcuts for future releases:

- **Ctrl+Z / Cmd+Z**: Undo (when editing features are added)
- **Shift+Ctrl+Z / Shift+Cmd+Z**: Redo (when editing features are added)
- **Arrow Keys**: Nudge selection by 1px or 10px with Shift (when editing features are added)
- **Delete**: Remove selected elements (when editing features are added)

## Browser Compatibility

Keyboard shortcuts are supported in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with external keyboards

## Tips

- Use the **?** key frequently to remind yourself of available shortcuts
- Space-drag is faster than mouse-only panning for exploring large canvases
- Zoom shortcuts (+ and −) work with or without the Shift key on most keyboards
