import React, { useState, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// --- DATA INITIAL (DUMMY DATA REKAM MEDIS) ---
const INITIAL_PATIENTS = [
  {
    id: 'RM-2026-001',
    nama: 'Budi Santoso',
    umur: 42,
    gender: 'Laki-laki',
    poli: 'Poli Penyakit Dalam',
    dokter: 'dr. Ahmad Dahlan, Sp.PD',
    tanggal: '2026-11-09',
    status: 'Selesai',
    keluhan: 'Kontrol rutin hipertensi dan cek gula darah berkala.'
  },
  {
    id: 'RM-2026-002',
    nama: 'Siti Rahmawati',
    umur: 28,
    gender: 'Perempuan',
    poli: 'Poli Gigi & Mulut',
    dokter: 'drg. Maya Putri',
    tanggal: '2026-11-09',
    status: 'Dalam Pemeriksaan',
    keluhan: 'Nyeri pada gigi geraham kanan bawah saat mengunyah.'
  },
  {
    id: 'RM-2026-003',
    nama: 'Dian Sastro',
    umur: 35,
    gender: 'Perempuan',
    poli: 'Poli Anak',
    dokter: 'dr. Hendra Kusuma, Sp.A',
    tanggal: '2026-11-09',
    status: 'Menunggu',
    keluhan: 'Demam tinggi selama 2 hari disertai batuk pilek.'
  },
  {
    id: 'RM-2026-004',
    nama: 'Eko Prasetyo',
    umur: 55,
    gender: 'Laki-laki',
    poli: 'Poli Jantung',
    dokter: 'dr. Rizky Pratama, Sp.JP',
    tanggal: '2026-11-08',
    status: 'Dirujuk',
    keluhan: 'Nyeri dada menjalar ke lengan kiri saat beraktivitas berat.'
  }
];

const POLIKLINIK_LIST = [
  'Poli Umum',
  'Poli Penyakit Dalam',
  'Poli Gigi & Mulut',
  'Poli Anak',
  'Poli Jantung',
  'Poli Spesialis Mata'
];

export default function App() {
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPoli, setFilterPoli] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editId, setEditId] = useState(null);

  const initialFormState = {
    nama: '',
    umur: '',
    gender: 'Laki-laki',
    poli: 'Poli Umum',
    dokter: 'dr. Pertiwi Utami',
    tanggal: new Date().toISOString().split('T')[0],
    status: 'Menunggu',
    keluhan: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  const stats = useMemo(() => {
    return {
      total: patients.length,
      menunggu: patients.filter((p) => p.status === 'Menunggu').length,
      pemeriksaan: patients.filter((p) => p.status === 'Dalam Pemeriksaan').length,
      selesai: patients.filter((p) => p.status === 'Selesai').length,
      dirujuk: patients.filter((p) => p.status === 'Dirujuk').length
    };
  }, [patients]);

  const filteredPatients = useMemo(() => {
    return patients.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dokter.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPoli = filterPoli === 'Semua' || item.poli === filterPoli;
      const matchStatus = filterStatus === 'Semua' || item.status === filterStatus;

      return matchSearch && matchPoli && matchStatus;
    });
  }, [patients, searchTerm, filterPoli, filterStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreateModal = () => {
    setEditId(null);
    setFormData(initialFormState);
    setShowModal(true);
  };

  const handleOpenEditModal = (patient) => {
    setEditId(patient.id);
    setFormData({
      nama: patient.nama,
      umur: patient.umur,
      gender: patient.gender,
      poli: patient.poli,
      dokter: patient.dokter,
      tanggal: patient.tanggal,
      status: patient.status,
      keluhan: patient.keluhan
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.umur) return;

    if (editId) {
      setPatients((prev) =>
        prev.map((item) => (item.id === editId ? { ...item, ...formData, umur: Number(formData.umur) } : item))
      );
    } else {
      const newRmId = `RM-2026-${String(patients.length + 1).padStart(3, '0')}`;
      const newRecord = {
        id: newRmId,
        ...formData,
        umur: Number(formData.umur)
      };
      setPatients([newRecord, ...patients]);
    }

    setShowModal(false);
    setFormData(initialFormState);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus rekam medis dengan No. RM: ${id}?`)) {
      setPatients((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleOpenDetail = (patient) => {
    setSelectedPatient(patient);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selesai':
        return 'badge-status-success';
      case 'Dalam Pemeriksaan':
        return 'badge-status-info';
      case 'Menunggu':
        return 'badge-status-warning';
      case 'Dirujuk':
        return 'badge-status-secondary';
      default:
        return 'badge-status-light';
    }
  };

  return (
    <div className="app-layout">
      {/* TOPNAV HEADER */}
      <header className="med-navbar border-bottom sticky-top">
        <div className="container-fluid px-4 py-2 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div className="brand-icon d-flex align-items-center justify-content-center rounded-3">
              🏥
            </div>
            <div>
              <h1 className="h5 fw-bold mb-0 text-navy">MedisCare Dashboard</h1>
              <p className="small text-muted mb-0">Sistem Manajemen Rekam Medis Pasien Client-Side</p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-medical fw-semibold d-flex align-items-center gap-2 shadow-sm" onClick={handleOpenCreateModal}>
              <span>➕</span> Rekam Medis Baru
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="container-fluid px-4 py-4">
        {/* STATISTIK RINGKASAN */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small fw-semibold">Total Terdaftar</span>
                  <h3 className="fw-bold mb-0 text-navy">{stats.total}</h3>
                </div>
                <div className="stat-icon bg-light-cyan text-cyan-700">📋</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small fw-semibold">Antrean Menunggu</span>
                  <h3 className="fw-bold mb-0 text-amber-700">{stats.menunggu}</h3>
                </div>
                <div className="stat-icon bg-light-amber text-amber-700">⏳</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small fw-semibold">Dalam Pemeriksaan</span>
                  <h3 className="fw-bold mb-0 text-indigo-700">{stats.pemeriksaan}</h3>
                </div>
                <div className="stat-icon bg-light-indigo text-indigo-700">🩺</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 p-3 stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small fw-semibold">Selesai Berobat</span>
                  <h3 className="fw-bold mb-0 text-emerald-700">{stats.selesai}</h3>
                </div>
                <div className="stat-icon bg-light-emerald text-emerald-700">✅</div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION PENCARIAN & FILTER */}
        <div className="card border-0 shadow-sm rounded-3 p-3 mb-4">
          <div className="row g-3">
            <div className="col-12 col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">🔍</span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Cari Nama Pasien, No. RM, atau Dokter..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={filterPoli}
                onChange={(e) => setFilterPoli(e.target.value)}
              >
                <option value="Semua">Semua Poliklinik</option>
                {POLIKLINIK_LIST.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-3">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="Semua">Semua Status</option>
                <option value="Menunggu">Menunggu</option>
                <option value="Dalam Pemeriksaan">Dalam Pemeriksaan</option>
                <option value="Selesai">Selesai</option>
                <option value="Dirujuk">Dirujuk</option>
              </select>
            </div>

            <div className="col-12 col-md-1 d-flex align-items-center justify-content-end">
              <button
                className="btn btn-outline-secondary w-100"
                title="Reset Filter"
                onClick={() => {
                  setSearchTerm('');
                  setFilterPoli('Semua');
                  setFilterStatus('Semua');
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* TABEL DAFTAR REKAM MEDIS */}
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
          <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0 text-navy">Daftar Pasien & Rekam Kunjungan</h6>
            <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fs-7">
              Menampilkan {filteredPatients.length} dari {patients.length} data
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light text-muted small fw-semibold">
                <tr>
                  <th className="ps-4">NO. REKAM MEDIS</th>
                  <th>NAMA PASIEN</th>
                  <th>POLIKLINIK TUJUAN</th>
                  <th>DOKTER PJ</th>
                  <th>TANGGAL</th>
                  <th>STATUS</th>
                  <th className="text-end pe-4">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="ps-4 fw-bold text-cyan-700">{patient.id}</td>
                      <td>
                        <div className="fw-semibold text-slate-800">{patient.nama}</div>
                        <div className="small text-muted">{patient.gender}, {patient.umur} Thn</div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border px-2 py-1">{patient.poli}</span>
                      </td>
                      <td className="text-slate-700 small fw-medium">{patient.dokter}</td>
                      <td className="small text-muted">{patient.tanggal}</td>
                      <td>
                        <span className={`badge-status ${getStatusBadge(patient.status)}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="btn-group gap-1">
                          <button
                            className="btn btn-sm btn-light border text-secondary"
                            title="Detail Rekam Medis"
                            onClick={() => handleOpenDetail(patient)}
                          >
                            👁️ Detail
                          </button>
                          <button
                            className="btn btn-sm btn-light border text-primary"
                            title="Edit Data"
                            onClick={() => handleOpenEditModal(patient)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-sm btn-light border text-danger"
                            title="Hapus Record"
                            onClick={() => handleDelete(patient.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <div className="fs-1 mb-2">📁</div>
                      <p className="fw-semibold mb-1">Data Rekam Medis Tidak Ditemukan</p>
                      <p className="small mb-0">Coba ubah kata kunci pencarian atau reset filter kategori.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL FORM (CREATE / EDIT) */}
      {showModal && (
        <div className="modal-backdrop-custom d-flex justify-content-center align-items-center">
          <div className="card border-0 shadow-lg modal-card rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <h5 className="fw-bold mb-0 text-navy">
                {editId ? `Edit Rekam Medis (${editId})` : 'Pendaftaran Rekam Medis Baru'}
              </h5>
              <button className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <label className="form-label fw-semibold small">Nama Lengkap Pasien</label>
                  <input
                    type="text"
                    name="nama"
                    className="form-control"
                    placeholder="Masukkan nama lengkap..."
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-6 col-md-2">
                  <label className="form-label fw-semibold small">Umur (Thn)</label>
                  <input
                    type="number"
                    name="umur"
                    className="form-control"
                    placeholder="25"
                    value={formData.umur}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>

                <div className="col-6 col-md-2">
                  <label className="form-label fw-semibold small">Jenis Kelamin</label>
                  <select name="gender" className="form-select" value={formData.gender} onChange={handleInputChange}>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Poliklinik Tujuan</label>
                  <select name="poli" className="form-select" value={formData.poli} onChange={handleInputChange}>
                    {POLIKLINIK_LIST.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Dokter Penanggung Jawab</label>
                  <input
                    type="text"
                    name="dokter"
                    className="form-control"
                    value={formData.dokter}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Tanggal Kunjungan</label>
                  <input
                    type="date"
                    name="tanggal"
                    className="form-control"
                    value={formData.tanggal}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Status Penanganan</label>
                  <select name="status" className="form-select" value={formData.status} onChange={handleInputChange}>
                    <option value="Menunggu">Menunggu</option>
                    <option value="Dalam Pemeriksaan">Dalam Pemeriksaan</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dirujuk">Dirujuk</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold small">Keluhan Utama / Catatan Medis</label>
                  <textarea
                    name="keluhan"
                    className="form-control"
                    rows="3"
                    placeholder="Tuliskan gejala atau keluhan pasien saat datang..."
                    value={formData.keluhan}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-medical px-4 fw-semibold">
                  {editId ? 'Simpan Perubahan' : 'Tambah Pasien'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETAIL PASIEN */}
      {showDetailModal && selectedPatient && (
        <div className="modal-backdrop-custom d-flex justify-content-center align-items-center">
          <div className="card border-0 shadow-lg modal-card rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <div>
                <span className="badge bg-light-cyan text-cyan-700 fw-bold mb-1">{selectedPatient.id}</span>
                <h5 className="fw-bold mb-0 text-navy">{selectedPatient.nama}</h5>
              </div>
              <button className="btn-close" onClick={() => setShowDetailModal(false)}></button>
            </div>

            <div className="row g-3">
              <div className="col-6">
                <span className="text-muted small">Usia / Gender</span>
                <p className="fw-semibold mb-0">{selectedPatient.umur} Tahun ({selectedPatient.gender})</p>
              </div>
              <div className="col-6">
                <span className="text-muted small">Status Penanganan</span>
                <div>
                  <span className={`badge-status ${getStatusBadge(selectedPatient.status)}`}>
                    {selectedPatient.status}
                  </span>
                </div>
              </div>

              <div className="col-6">
                <span className="text-muted small">Poliklinik Tujuan</span>
                <p className="fw-semibold mb-0">{selectedPatient.poli}</p>
              </div>
              <div className="col-6">
                <span className="text-muted small">Dokter Penanggung Jawab</span>
                <p className="fw-semibold mb-0">{selectedPatient.dokter}</p>
              </div>

              <div className="col-12">
                <span className="text-muted small">Tanggal Kunjungan</span>
                <p className="fw-semibold mb-0">{selectedPatient.tanggal}</p>
              </div>

              <div className="col-12">
                <div className="bg-light p-3 rounded-3 border">
                  <span className="text-muted small fw-bold d-block mb-1">Catatan Keluhan Pasien:</span>
                  <p className="mb-0 text-slate-700">{selectedPatient.keluhan || 'Tidak ada catatan keluhan tambahan.'}</p>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button className="btn btn-secondary px-4" onClick={() => setShowDetailModal(false)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}