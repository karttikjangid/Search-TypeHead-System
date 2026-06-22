export default function Toast({ message, visible }) {
  return (
    <div
      style={{
        ...s.toast,
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(8px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      Searched: <strong>{message}</strong>
    </div>
  )
}

const s = {
  toast: {
    position: 'fixed',
    bottom: '32px',
    left: '50%',
    zIndex: 9999,
    background: '#1A1A1A',
    border: '1px solid #6C63FF',
    borderRadius: '8px',
    padding: '12px 20px',
    color: '#FFFFFF',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    transition: 'opacity 200ms ease, transform 200ms ease',
  },
}
