import { useState } from 'react'
import { Cpu, Plus, Layers, Copy, CheckCircle } from 'lucide-react'
import { contenedorService } from '../../services/contenedorService'

export default function InventarioPage() {
    const [deviceId, setDeviceId] = useState('')
    const [loteText, setLoteText] = useState('')
    const [loading, setLoading] = useState(false)
    const [loteLoading, setLoteLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [loteResult, setLoteResult] = useState(null)
    const [error, setError] = useState('')

    const provisionarUno = async (e) => {
        e.preventDefault()
        setError('')
        setResult(null)
        if (!deviceId.trim()) {
            setError('Ingresa un device_id')
            return
        }
        setLoading(true)
        try {
            const data = await contenedorService.inventario({
                device_id: deviceId.trim(),
            })
            setResult(data)
            setDeviceId('')
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Error al provisionar dispositivo'
            )
        } finally {
            setLoading(false)
        }
    }

    const provisionarLote = async (e) => {
        e.preventDefault()
        setError('')
        setLoteResult(null)
        const lines = loteText
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean)

        if (lines.length === 0) {
            setError('Ingresa al menos un device_id por línea')
            return
        }
        if (lines.length > 1000) {
            setError('Máximo 1000 dispositivos por lote')
            return
        }

        setLoteLoading(true)
        try {
            // Ajusta el body si tu API espera otro formato
            const data = await contenedorService.inventarioLote({
                dispositivos: lines.map((device_id) => ({ device_id })),
            })
            setLoteResult(data)
            setLoteText('')
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Error en inventario por lote'
            )
        } finally {
            setLoteLoading(false)
        }
    }

    const copyText = (text) => {
        if (text) navigator.clipboard.writeText(String(text))
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Inventario IoT</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Provisionar dispositivos ESP32 sin organización (código de vinculación)
                </p>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                    {error}
                </div>
            )}

            {/* Uno */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Cpu size={18} className="text-[#6EA838]" />
                    Provisionar un dispositivo
                </h2>
                <form onSubmit={provisionarUno} className="flex flex-col sm:flex-row gap-3">
                    <input
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                        placeholder="device_id del ESP32 (ej. ESP32-A1B2C3)"
                        className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6EA838] hover:bg-[#5a8f2e] text-white text-sm font-medium rounded-xl disabled:opacity-60"
                    >
                        <Plus size={16} />
                        {loading ? 'Guardando...' : 'Provisionar'}
                    </button>
                </form>

                {result && (
                    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm space-y-2">
                        <div className="flex items-center gap-2 text-emerald-700 font-medium">
                            <CheckCircle size={16} />
                            Dispositivo en inventario
                        </div>
                        <pre className="text-xs bg-white/80 p-3 rounded-lg overflow-x-auto text-gray-700">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                        {(result.codigo_vinculacion || result.codigo) && (
                            <button
                                type="button"
                                onClick={() =>
                                    copyText(result.codigo_vinculacion || result.codigo)
                                }
                                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:underline"
                            >
                                <Copy size={12} />
                                Copiar código de vinculación
                            </button>
                        )}
                    </div>
                )}
            </section>

            {/* Lote */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Layers size={18} className="text-blue-500" />
                    Provisionar por lote
                </h2>
                <p className="text-xs text-gray-400 mb-3">
                    Un <code className="bg-gray-50 px-1 rounded">device_id</code> por línea (máx. 1000)
                </p>
                <form onSubmit={provisionarLote} className="space-y-3">
                    <textarea
                        value={loteText}
                        onChange={(e) => setLoteText(e.target.value)}
                        rows={6}
                        placeholder={'ESP32-001\nESP32-002\nESP32-003'}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#6EA838] resize-y"
                    />
                    <button
                        type="submit"
                        disabled={loteLoading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl disabled:opacity-60"
                    >
                        <Layers size={16} />
                        {loteLoading ? 'Procesando...' : 'Provisionar lote'}
                    </button>
                </form>

                {loteResult && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm">
                        <p className="font-medium text-blue-800 mb-2">Resultado del lote</p>
                        <pre className="text-xs bg-white/80 p-3 rounded-lg overflow-x-auto text-gray-700 max-h-48">
                            {JSON.stringify(loteResult, null, 2)}
                        </pre>
                    </div>
                )}
            </section>

            <p className="text-xs text-gray-400">
                Si el body del lote no coincide con tu API, ajusta{' '}
                <code className="bg-gray-50 px-1 rounded">inventarioLote</code> en{' '}
                <code className="bg-gray-50 px-1 rounded">contenedorService.js</code>.
            </p>
        </div>
    )
}