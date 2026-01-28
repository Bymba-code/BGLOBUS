'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import axiosInstance from '@/config/axiosConfig'

interface Translation {
  id: number
  label: string
  language_id: number
}

interface TertiaryMenu {
  id: number
  path: string
  font: string | number
  index: number
  visible: number
  translations: Translation[]
}

interface Submenu {
  id: number
  path: string
  font: number
  index: number
  visible: number
  translations: Translation[]
  tertiary_menus: TertiaryMenu[]
}

interface Menu {
  id: number
  path: string
  font: number
  index: number
  visible: number
  translations: Translation[]
  submenus: Submenu[]
}

interface Style {
  id: number
  bgcolor: string
  fontcolor: string
  hovercolor: string
  height: number
  sticky: number
}

interface Category {
  id: number
  logo: string
  active: number
  styles: Style[]
  menus: Menu[]
}

export default function Header() {
  const { language, setLanguage } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const [activeSubDropdown, setActiveSubDropdown] = useState<number | null>(null)
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<number | null>(null)
  const [mobileActiveSubDropdown, setMobileActiveSubDropdown] = useState<number | null>(null)
  const [langOpen, setLangOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)

  // Fetch categories from 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/headers/')
        if (response && response.status === 200) {
          setCategories(response?.data || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const activeCategory = categories.find(cat => cat.active === 1)
  const headerStyle = activeCategory?.styles?.[0]
  const menus = activeCategory?.menus || []

  const sortedMenus = [...menus].sort((a, b) => a.index - b.index).filter(m => m.visible === 1)

  const getTranslation = (translations: Translation[]) => {
    const langId = language === 'mn' ? 2 : 1
    const translation = translations.find(t => t.language_id === langId)
    return translation?.label || translations[0]?.label || ''
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 6)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
        setActiveSubDropdown(null)
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[1240px] z-[99999]">
        <div className="w-full rounded-2xl bg-white/70 backdrop-blur-lg shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-white/40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 lg:h-16">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex gap-4">
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[1240px] z-[99999]">
      <header
        className={`w-full rounded-2xl transition-all duration-300 border ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-white/50'
            : 'bg-white/70 backdrop-blur-lg shadow-[0_4px_24px_rgba(0,0,0,0.08)] border-white/40'
        }`}
        style={{
          backgroundColor: headerStyle?.bgcolor ? `${headerStyle.bgcolor}cc` : undefined,
          height: headerStyle?.height ? `${headerStyle.height}px` : undefined,
        }}
      >
        <div className="px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-6 lg:gap-8">
              <Link href="/" className="flex items-center">
                <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full overflow-hidden flex items-center justify-center">
                  {activeCategory?.logo ? (
                    activeCategory.logo.startsWith('http') ? (
                      <Image
                        src={activeCategory.logo}
                        alt="Logo"
                        width={44}
                        height={44}
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-xs font-bold"
                        style={{ color: headerStyle?.fontcolor || '#000' }}
                      >
                        {activeCategory.logo}
                      </div>
                    )
                  ) : (
                    <Image
                      src="/images/logo.jpg"
                      alt="Logo"
                      width={44}
                      height={44}
                      className="object-cover"
                    />
                  )}
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
                {sortedMenus.map((menu) => {
                  const hasSubmenus = menu.submenus && menu.submenus.length > 0
                  const visibleSubmenus = hasSubmenus
                    ? menu.submenus.filter(sm => sm.visible === 1).sort((a, b) => a.index - b.index)
                    : []

                  return (
                    <div
                      key={menu.id}
                      className="relative"
                      onMouseEnter={() => hasSubmenus && setActiveDropdown(menu.id)}
                      onMouseLeave={() => {
                        if (!hasSubmenus) return
                        setActiveDropdown(null)
                        setActiveSubDropdown(null)
                      }}
                    >
                      {hasSubmenus ? (
                        <>
                          <button
                            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
                            style={{
                              color: activeDropdown === menu.id
                                ? headerStyle?.hovercolor || '#0d9488'
                                : headerStyle?.fontcolor || '#374151',
                              backgroundColor: activeDropdown === menu.id ? '#f3f4f6' : 'transparent',
                            }}
                          >
                            {getTranslation(menu.translations)}
                            <svg
                              className={`w-4 h-4 transition-transform ${
                                activeDropdown === menu.id ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>

                          {activeDropdown === menu.id && (
                            <div className="absolute top-full left-0 pt-2 w-72">
                              <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                                {visibleSubmenus.map((submenu) => {
                                  const hasTertiaryMenus = submenu.tertiary_menus && submenu.tertiary_menus.length > 0
                                  const visibleTertiaryMenus = hasTertiaryMenus
                                    ? submenu.tertiary_menus.filter(tm => tm.visible === 1).sort((a, b) => a.index - b.index)
                                    : []

                                  return (
                                    <div
                                      key={submenu.id}
                                      className="relative"
                                      onMouseEnter={() => setActiveSubDropdown(submenu.id)}
                                    >
                                      {hasTertiaryMenus ? (
                                        <div
                                          className={`flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer ${
                                            activeSubDropdown === submenu.id ? 'bg-gray-50' : ''
                                          }`}
                                        >
                                          <div className="text-sm font-medium text-gray-900">
                                            {getTranslation(submenu.translations)}
                                          </div>
                                          <svg
                                            className="w-4 h-4 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M9 5l7 7-7 7"
                                            />
                                          </svg>
                                        </div>
                                      ) : (
                                        <Link
                                          href={submenu.path}
                                          className="block px-4 py-2.5 hover:bg-gray-50 text-sm font-medium text-gray-900 hover:text-teal-600"
                                          onClick={() => {
                                            setActiveDropdown(null)
                                            setActiveSubDropdown(null)
                                          }}
                                        >
                                          {getTranslation(submenu.translations)}
                                        </Link>
                                      )}

                                      {activeSubDropdown === submenu.id && hasTertiaryMenus && (
                                        <div className="absolute left-full top-0 pl-2 w-64">
                                          <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                                            {visibleTertiaryMenus.map((tertiary) => (
                                              <Link
                                                key={tertiary.id}
                                                href={tertiary.path}
                                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600"
                                                onClick={() => {
                                                  setActiveDropdown(null)
                                                  setActiveSubDropdown(null)
                                                }}
                                              >
                                                {getTranslation(tertiary.translations)}
                                              </Link>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={menu.path || '#'}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                          style={{
                            color: headerStyle?.fontcolor || '#374151',
                          }}
                        >
                          {getTranslation(menu.translations)}
                        </Link>
                      )}
                    </div>
                  )
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  aria-label="Хэл сонгох"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    {language === 'mn' ? 'MN' : 'EN'}
                  </span>
                  <svg
                    className={`w-3 h-3 text-gray-500 transition-transform ${langOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {langOpen && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                    <button
                      onClick={() => {
                        setLanguage('mn')
                        setLangOpen(false)
                      }}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                        language === 'mn'
                          ? 'text-teal-600 bg-teal-50 hover:bg-teal-100'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base">🇲🇳</span>
                      Монгол
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('en')
                        setLangOpen(false)
                      }}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                        language === 'en'
                          ? 'text-teal-600 bg-teal-50 hover:bg-teal-100'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base">🇺🇸</span>
                      English
                    </button>
                  </div>
                )}
              </div>

              <button
                className="lg:hidden p-2.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Цэс"
              >
                {mobileOpen ? (
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100">
              <nav className="space-y-1 max-h-[70vh] overflow-y-auto">
                {sortedMenus.map((menu) => {
                  const hasSubmenus = menu.submenus && menu.submenus.length > 0
                  const visibleSubmenus = hasSubmenus
                    ? menu.submenus.filter(sm => sm.visible === 1).sort((a, b) => a.index - b.index)
                    : []

                  return (
                    <div key={menu.id}>
                      {hasSubmenus ? (
                        <div>
                          <button
                            onClick={() =>
                              setMobileActiveDropdown(mobileActiveDropdown === menu.id ? null : menu.id)
                            }
                            className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-50/80 rounded-lg"
                          >
                            <span className="font-medium">{getTranslation(menu.translations)}</span>
                            <svg
                              className={`w-5 h-5 transition-transform duration-200 ${
                                mobileActiveDropdown === menu.id ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>

                          {mobileActiveDropdown === menu.id && (
                            <div className="pl-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                              {visibleSubmenus.map((submenu) => {
                                const hasTertiaryMenus = submenu.tertiary_menus && submenu.tertiary_menus.length > 0
                                const visibleTertiaryMenus = hasTertiaryMenus
                                  ? submenu.tertiary_menus.filter(tm => tm.visible === 1).sort((a, b) => a.index - b.index)
                                  : []

                                return (
                                  <div key={submenu.id}>
                                    {hasTertiaryMenus ? (
                                      <>
                                        <button
                                          onClick={() =>
                                            setMobileActiveSubDropdown(
                                              mobileActiveSubDropdown === submenu.id ? null : submenu.id
                                            )
                                          }
                                          className="flex items-center justify-between w-full px-4 py-2.5 text-gray-600 hover:bg-gray-50/80 rounded-lg"
                                        >
                                          <span className="text-sm">{getTranslation(submenu.translations)}</span>
                                          <svg
                                            className={`w-4 h-4 transition-transform duration-200 ${
                                              mobileActiveSubDropdown === submenu.id ? 'rotate-90' : ''
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M9 5l7 7-7 7"
                                            />
                                          </svg>
                                        </button>

                                        {mobileActiveSubDropdown === submenu.id && (
                                          <div className="pl-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                            {visibleTertiaryMenus.map((tertiary) => (
                                              <Link
                                                key={tertiary.id}
                                                href={tertiary.path}
                                                className="block px-4 py-2 text-sm text-gray-500 hover:text-teal-600 hover:bg-gray-50/80 rounded-lg"
                                                onClick={() => {
                                                  setMobileOpen(false)
                                                  setMobileActiveDropdown(null)
                                                  setMobileActiveSubDropdown(null)
                                                }}
                                              >
                                                {getTranslation(tertiary.translations)}
                                              </Link>
                                            ))}
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <Link
                                        href={submenu.path}
                                        className="block px-4 py-2.5 text-sm text-gray-600 hover:text-teal-600 hover:bg-gray-50/80 rounded-lg"
                                        onClick={() => {
                                          setMobileOpen(false)
                                          setMobileActiveDropdown(null)
                                        }}
                                      >
                                        {getTranslation(submenu.translations)}
                                      </Link>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={menu.path || '#'}
                          className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50/80 rounded-lg"
                          onClick={() => setMobileOpen(false)}
                        >
                          {getTranslation(menu.translations)}
                        </Link>
                      )}
                    </div>
                  )
                })}
              </nav>
            </div>
          )}
        </div>
      </header>
    </div>
  )
}