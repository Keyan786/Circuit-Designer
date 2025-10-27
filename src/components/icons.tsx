import React from 'react'
import mousePointerClickSvg from '../assets/mouse-pointer-click.svg'
import slashSvg from '../assets/slash.svg'
import transformSvg from '../assets/transform.svg'
import textSvg from '../assets/text.svg'

export const IconRotate = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M12 5v4l3-3m5 6a8 8 0 1 1-8-8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconTrash = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconMove = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M12 2l3 3-3 3-3-3 3-3zm0 14l3 3-3 3-3-3 3-3zM2 12l3-3 3 3-3 3-3-3zm14 0l3-3 3 3-3 3-3-3z" />
  </svg>
)

export const IconChip = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="7" y="7" width="10" height="10" rx="2" />
    <path d="M11 11h2v2h-2zM7 3v4M17 3v4M7 21v-4M17 21v-4M3 7h4M3 17h4M21 7h-4M21 17h-4" />
  </svg>
)

export const IconResistor = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M2 12h8m4 0h20m12 0h-8" />
    <rect x="14" y="6" width="20" height="12" rx="2" />
  </svg>
)

export const IconSave = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17,21 17,13 7,13 7,21" />
    <polyline points="7,3 7,8 15,8" />
  </svg>
)

export const IconFolderOpen = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <path d="M2 19l4-7 3 3 4-5 5 2" />
  </svg>
)

export const IconDownload = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

export const IconPlus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export const IconChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <polyline points="6,9 12,15 18,9" />
  </svg>
)

export const IconSelect = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={mousePointerClickSvg} alt="Select" className="w-5 h-5 brightness-0 invert" style={{ filter: 'brightness(0) invert(1)' }} {...props} />
)

export const IconWire = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={slashSvg} alt="Wire" className="w-5 h-5 brightness-0 invert" style={{ filter: 'brightness(0) invert(1)' }} {...props} />
)

export const IconText = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={textSvg} alt="Text" className="w-5 h-5 brightness-0 invert" style={{ filter: 'brightness(0) invert(1)' }} {...props} />
)

export const IconNode = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={transformSvg} alt="Node" className="w-5 h-5 brightness-0 invert" style={{ filter: 'brightness(0) invert(1)' }} {...props} />
)

export const IconGrid = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M3 3h18v18H3z" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
  </svg>
)

export const IconRuler = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M2 8l20 0" />
    <path d="M2 16l20 0" />
    <path d="M3 6l0 4" strokeWidth="1.5" />
    <path d="M6 6l0 4" strokeWidth="1.5" />
    <path d="M9 6l0 4" strokeWidth="1.5" />
    <path d="M12 6l0 4" strokeWidth="1.5" />
    <path d="M15 6l0 4" strokeWidth="1.5" />
    <path d="M18 6l0 4" strokeWidth="1.5" />
    <path d="M21 6l0 4" strokeWidth="1.5" />
  </svg>
)


