import React, { useEffect, useState } from 'react'
import Compressor from 'compressorjs'
import axios from 'axios'
import prettyBytes from '../lib/prettyBytes'
import * as StackBlur from 'stackblur-canvas'

const ImgCard = ({ id, file }) => {
  const defaultOpts = [
    {
      label: 'placeholder',
      quality: 0.6,
      width: 60,
      blur: 20
    },
    {
      label: 'small',
      quality: 0.8,
      width: 640
    },
    {
      label: 'medium',
      quality: 0.8,
      width: 1024
    },
    {
      label: 'high',
      quality: 0.8,
      width: 1920
    }
  ]
  const [previewImg, setPreviewImg] = useState(null)
  const [code, setCode] = useState(null)
  const [tab, setTab] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [imgListUrl, setImgListUrl] = useState([])

  const _copy = (id) => {
    const copyText = document.getElementById(id)

    copyText.select();
    copyText.setSelectionRange(0, 99999); 

    document.execCommand('copy')
  }
  
  const _compressFile = (file, opts) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: opts.quality || 0.6,
        width: opts.width || 400,
        drew(context, canvas) {
          if(opts.blur) {
            StackBlur.canvasRGBA(canvas, 0, 0, canvas.width, canvas.height, opts.blur)
          }
        },
        success(result) {
          resolve(result)
        },
        error(err) {
          reject(err)
        },
      });
    })
  }

  const _readFileAsUrl = (file) => {
    const temporaryFileReader = new FileReader()
    
    return new Promise((resolve, reject) => {
      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result)
      }
      temporaryFileReader.readAsDataURL(file)
    })
  }

  const _upload = async (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('file', file)

      axios.post(`https://siasky.net/skynet/skyfile`, formData)
        .then(resp => {
          resolve(`https://siasky.net/${resp.data.skylink}`)
        }).catch(error => {
          reject(error)
        })
    })
  }

  useEffect(() => {
    const init = async () => {
      file.url = await _readFileAsUrl(file)
      setPreviewImg(file)
      setUploading(true)
      setCode(null)

      const compressList = defaultOpts.map(opt => _compressFile(file, opt))
      const resultImgFile = await Promise.all(compressList)
      const resultUpload = await Promise.all(resultImgFile.map(file => _upload(file)))
      setUploading(false)
      setImgListUrl([...resultUpload])
      setCode(`
        <img alt=${file.name} class="lazy" src=${resultUpload[0]} data-srcset="${resultUpload[1]} 640w, ${resultUpload[2]} 1024w, ${resultUpload[3]} 1920w" />
      `)
    }
    init()
  }, [])

  return (
    <div className="bg-white shadow-lg relative">
      {
        uploading && (
          <div className="absolute inset-0 bg-black z-10 opacity-25"></div>
        )
      }
      {
        previewImg && (
          <div className="p-4">
            <div className="flex items-center h-32 md:h-48">
              <div className="w-4/12 h-full flex items-center">
                <img className="m-auto" style={{
                  maxHeight: `100%`,
                }} src={previewImg.url} />
              </div>
              <div className="w-7/12 px-4 overflow-hidden">
                <p className="truncate font-bold">{previewImg.name}</p>
                <p className="text-gray-600">{prettyBytes(previewImg.size)}</p>
              </div>
              <div className="w-1/12">
                {
                  uploading ? (
                    <svg className="ml-auto" width="24" height="24" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                      <circle cx="50" cy="50" fill="none" stroke="#57B560" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(34.4164 50 50)">
                        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1">
                        </animateTransform></circle>
                    </svg>
                  ) : (
                    <svg className="ml-auto"  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 6L9 18L3 12" stroke="#57B560" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )
                }
              </div>
            </div>
          </div>
        )
      }
      {
        imgListUrl.length > 0 && code && (
          <div className="p-4 pt-0">
            <div className="flex">
              <p className={`${tab === 0 ? 'underline' : 'text-gray-600'} cursor-pointer font-semibold`} onClick={() => setTab(0)}>Images</p>
              <p className={`${tab === 1 ? 'underline' : 'text-gray-600'} cursor-pointer font-semibold ml-4`} onClick={() => setTab(1)}>Code</p>
            </div>
            {
              tab === 0 && (
                <div className="mt-2">
                  <div className="border border-solid border-gray-600 p-4">
                    {
                      imgListUrl.map((url, idx) => {
                        return (
                          <div className="mt-1" key={idx}>
                            <p className="capitalize">{defaultOpts[idx].label}</p>
                            <div className="mt-1 flex items-center">
                              <code className="text-sm w-3/4">
                                <input id={`${idx}_${url}`} readOnly={true} className="w-full p-2 border border-solid border-gray-300 bg-gray-300" value={ url } />
                              </code>
                              <div className="w-1/4 pl-4">
                                <button onClick={() => _copy(`${idx}_${url}`)} className="uppercase py-2 px-4 bg-gray-900 text-white" style={{
                                  backgroundColor: `#57B560`
                                }}>Copy</button>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              )
            }
            {
              tab === 1 && (
                <div className="mt-2">
                  <div className="border border-solid border-gray-600 p-4">
                    <code className="text-sm">
                      <textarea readOnly={true} className="resize-none h-24 w-full p-2 bg-gray-300" id={id} value={ code.trim() }></textarea>
                    </code>
                  </div>
                  <div className="mt-4">
                    <button onClick={() => _copy(id)} className="uppercase py-2 px-4 bg-gray-900 text-white" style={{
                      backgroundColor: `#57B560`
                    }}>Copy</button>
                  </div>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
}

export default ImgCard