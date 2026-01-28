'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import axiosInstance from '@/config/axiosConfig'

interface Translation {
  id: number
  label: string
  language_id: number
}

interface Position {
  id: number
  top: number
  left: number
  rotate: number
  size: number
}

interface Title {
  id: number
  translations: Translation[]
  positions: Position[]
}

interface List {
  id: number
  translations: Translation[]
}

interface AppDownloadData {
  id: number
  image: string
  appstore: string
  playstore: string
  title_position: number
  divide: number
  font: string
  titlecolor: string
  fontcolor: string
  listcolor: string
  iconcolor: string
  buttonbgcolor: string
  buttonfontcolor: string
  lists: List[]
  titles: Title[]
}

export default function AppDownload() {
  const { language } = useLanguage()
  const [appData, setAppData] = useState<AppDownloadData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppDownloadData = async () => {
      try {
        const response = await axiosInstance.get('/app-download/') // API endpoint
        if (response && response.status === 200) {
          const activeData = response.data.find((item: AppDownloadData) => item.divide !== 0) || response.data[0]
          setAppData(activeData)
        }
      } catch (err) {
        console.error('Error fetching app download data:', err)
        setAppData({
          id: 1,
          image: '/App.svg',
          appstore: 'https://apps.apple.com',
          playstore: 'https://play.google.com',
          title_position: 1,
          divide: 1,
          font: 'Roboto',
          titlecolor: '#1e293b',
          fontcolor: '#475569',
          listcolor: '#475569',
          iconcolor: '#3b82f6',
          buttonbgcolor: '#6ee7b7',
          buttonfontcolor: '#ffffff',
          lists: [
            {
              id: 1,
              translations: [
                { id: 1, label: '24/7 loan information check', language_id: 1 },
                { id: 2, label: '24/7 зээлийн мэдээлэл шалгах', language_id: 2 }
              ]
            },
            {
              id: 2,
              translations: [
                { id: 3, label: 'Pay from anywhere', language_id: 1 },
                { id: 4, label: 'Хаанаас ч төлбөр төлөх', language_id: 2 }
              ]
            },
            {
              id: 3,
              translations: [
                { id: 5, label: 'Quick loan application', language_id: 1 },
                { id: 6, label: 'Хурдан зээлийн хүсэлт илгээх', language_id: 2 }
              ]
            },
            {
              id: 4,
              translations: [
                { id: 7, label: 'Privacy and security', language_id: 1 },
                { id: 8, label: 'Нууцлал, аюулгүй байдал', language_id: 2 }
              ]
            }
          ],
          titles: [
            {
              id: 1,
              translations: [
                { id: 1, label: 'Our', language_id: 1 },
                { id: 2, label: 'Манай', language_id: 2 }
              ],
              positions: [{ id: 1, top: 6, left: 0, rotate: -2, size: 60 }]
            },
            {
              id: 2,
              translations: [
                { id: 3, label: 'app', language_id: 1 },
                { id: 4, label: 'апп-аар', language_id: 2 }
              ],
              positions: [{ id: 2, top: 24, left: 14, rotate: 3, size: 70 }]
            },
            {
              id: 3,
              translations: [
                { id: 5, label: 'easier,', language_id: 1 },
                { id: 6, label: 'илүү хялбар,', language_id: 2 }
              ],
              positions: [{ id: 3, top: 44, left: 0, rotate: -1, size: 50 }]
            },
            {
              id: 4,
              translations: [
                { id: 7, label: 'faster', language_id: 1 },
                { id: 8, label: 'хурдан', language_id: 2 }
              ],
              positions: [{ id: 4, top: 60, left: 20, rotate: 2, size: 60 }]
            }
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAppDownloadData()
  }, [])

  const getTranslation = (translations: Translation[]) => {
    const langId = language === 'mn' ? 2 : 1
    const translation = translations.find(t => t.language_id === langId)
    return translation?.label || translations[0]?.label || ''
  }

  const isExternalUrl = (url: string) => {
    return url.startsWith('http://') || url.startsWith('https://')
  }

  const getColor = (color: string, defaultColor: string) => {
    return color && color !== '#' ? color : defaultColor
  }

  if (loading) {
    return (
      <section className="relative overflow-hidden py-20 md:py-28 px-5 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md h-[500px] bg-gray-200 rounded-3xl animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-40 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-16 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!appData) {
    return null
  }

  return (
    <section
      className="relative overflow-hidden py-20 md:py-28 px-5 bg-gradient-to-b from-slate-50 to-white"
      style={{ fontFamily: appData.font || 'inherit' }}
    >
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-blue-500/10 blur-3xl rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          <div className="flex justify-center lg:justify-end relative lg:order-2">
            <div className="absolute -inset-10 bg-blue-500/5 blur-3xl rounded-full" />

            {isExternalUrl(appData.image) ? (
              <img
                src={appData.image}
                alt="Mobile App"
                className="relative z-10 w-full max-w-md drop-shadow-[0_40px_80px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:-translate-y-1"
              />
            ) : (
              <img
                src={appData.image}
                alt="Mobile App"
                className="relative z-10 w-full max-w-md drop-shadow-[0_40px_80px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:-translate-y-1"
              />
            )}
          </div>

          <div className="flex flex-col gap-8 text-center lg:text-left lg:order-1">

            {appData.titles.length > 0 && (
              <div className="relative min-h-[300px] md:min-h-[340px]">
                {appData.titles.map((title, index) => {
                  const position = title.positions[0]
                  const text = getTranslation(title.translations)
                  
                  if (!text) return null

                  return (
                    <span
                      key={title.id}
                      className="absolute font-extrabold"
                      style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        transform: `rotate(${position.rotate}deg)`,
                        fontSize: `${position.size}px`,
                        color: getColor(appData.titlecolor, '#1e293b'),
                        ...(index === 1 && { color: getColor(appData.buttonbgcolor, '#6ee7b7') })
                      }}
                    >
                      {text}
                    </span>
                  )
                })}
              </div>
            )}
            {appData.lists.length > 0 && (
              <div className="flex flex-col gap-4 mt-2">
                {appData.lists.map((list) => {
                  const text = getTranslation(list.translations)
                  if (!text) return null

                  return (
                    <div key={list.id} className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: `${getColor(appData.iconcolor, '#3b82f6')}20`
                        }}
                      >
                        <span
                          className="text-sm font-semibold"
                          style={{ color: getColor(appData.iconcolor, '#3b82f6') }}
                        >
                          ✓
                        </span>
                      </div>
                      <span
                        className="text-sm sm:text-base"
                        style={{ color: getColor(appData.listcolor, '#475569') }}
                      >
                        {text}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">

              {appData.appstore && (
                <a
                  href={appData.appstore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg border hover:backdrop-blur-md"
                  style={{
                    backgroundColor: getColor(appData.buttonbgcolor, '#6ee7b7'),
                    color: getColor(appData.buttonfontcolor, '#ffffff'),
                    borderColor: `${getColor(appData.buttonbgcolor, '#6ee7b7')}66`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.6)'
                    e.currentTarget.style.color = '#1e293b'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = getColor(appData.buttonbgcolor, '#6ee7b7')
                    e.currentTarget.style.color = getColor(appData.buttonfontcolor, '#ffffff')
                    e.currentTarget.style.borderColor = `${getColor(appData.buttonbgcolor, '#6ee7b7')}66`
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  App Store
                </a>
              )}

              {appData.playstore && (
                <a
                  href={appData.playstore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border border-slate-200 text-slate-800 font-medium hover:bg-slate-100 transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                  </svg>
                  Google Play
                </a>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}