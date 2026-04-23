"use client";
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import styles from './profile.module.css';

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  desc: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  period: string;
  desc: string;
}

interface Cert {
  id: string;
  name: string;
  issuer: string;
  year: string;
  url: string;
  specialization: string;
}

function CertSection() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || 'guest';
  const [certs, setCerts] = useState<Cert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newCert, setNewCert] = useState({ name: '', issuer: '', year: '', url: '', specialization: '' });

  useEffect(() => {
    const certKey = `karrirpath_certs_${userEmail}`;
    const saved = localStorage.getItem(certKey);
    if (saved) setCerts(JSON.parse(saved));
  }, [userEmail]);

  const save = (updated: Cert[]) => {
    setCerts(updated);
    const certKey = `karrirpath_certs_${userEmail}`;
    localStorage.setItem(certKey, JSON.stringify(updated));
  };

  const addCert = () => {
    if (!newCert.name || !newCert.issuer) return;
    save([...certs, { id: Date.now().toString(), ...newCert }]);
    setNewCert({ name: '', issuer: '', year: '', url: '', specialization: '' });
    setShowForm(false);
  };

  const removeCert = (id: string) => save(certs.filter((c) => c.id !== id));

  const SPECIALIZATIONS = [
    'Frontend Development', 'Backend Development', 'Full Stack', 'Mobile Development',
    'UI/UX Design', 'Data Science', 'Machine Learning / AI', 'Cloud Computing',
    'Cybersecurity', 'DevOps', 'Product Management', 'Digital Marketing',
    'Business Analysis', 'Project Management', 'Lainnya',
  ];

  return (
    <div>
      <div className={styles.itemList}>
        {certs.map((cert) => (
          <div key={cert.id} className={styles.certItem}>
            <div className={styles.certLeft}>
              <div>
                <h4 className={styles.itemTitle}>{cert.name}</h4>
                <p className={styles.itemSubtitle}>{cert.issuer}</p>
                {cert.specialization && (
                  <span className={styles.certSpec}>{cert.specialization}</span>
                )}
              </div>
            </div>
            <div className={styles.certRight}>
              {cert.year && <span className={styles.itemPeriod}>{cert.year}</span>}
              {cert.url && (
                <a href={cert.url} target="_blank" rel="noopener noreferrer" className={styles.certLink}>
                  Lihat ↗
                </a>
              )}
              <button className={styles.itemRemoveBtn} onClick={() => removeCert(cert.id)}>Hapus</button>
            </div>
          </div>
        ))}
        {certs.length === 0 && (
          <p className={styles.staticEmpty}>Belum ada sertifikat. Tambahkan di bawah.</p>
        )}
      </div>

      {showForm && (
        <div className={styles.addForm}>
          <div className={styles.addFormRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nama Sertifikat</label>
              <input className={styles.input} value={newCert.name} onChange={(e) => setNewCert({ ...newCert, name: e.target.value })} placeholder="AWS Certified Developer" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Penerbit / Institusi</label>
              <input className={styles.input} value={newCert.issuer} onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })} placeholder="Amazon Web Services" />
            </div>
          </div>
          <div className={styles.addFormRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tahun</label>
              <input className={styles.input} value={newCert.year} onChange={(e) => setNewCert({ ...newCert, year: e.target.value })} placeholder="2024" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Spesialisasi</label>
              <select className={styles.select} value={newCert.specialization} onChange={(e) => setNewCert({ ...newCert, specialization: e.target.value })}>
                <option value="">-- Pilih Spesialisasi --</option>
                {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>URL Sertifikat (opsional)</label>
            <input className={styles.input} value={newCert.url} onChange={(e) => setNewCert({ ...newCert, url: e.target.value })} placeholder="https://credential.net/..." />
          </div>
          <div className={styles.addFormActions}>
            <button className={styles.cancelBtn} onClick={() => setShowForm(false)}>Batal</button>
            <button className={styles.saveBtn} onClick={addCert}>Simpan</button>
          </div>
        </div>
      )}

      {!showForm && (
        <button className={styles.addItemBtn} onClick={() => setShowForm(true)}>
          + Tambah Sertifikat
        </button>
      )}
    </div>
  );
}

function CvUploadSection() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || 'guest';
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvName, setCvName] = useState<string>('');
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    const cvKey = `karrirpath_cv_name_${userEmail}`;
    const saved = localStorage.getItem(cvKey);
    if (saved) { setCvName(saved); setUploaded(true); }
  }, [userEmail]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFile(file);
    setCvName(file.name);
    setUploaded(true);
    const cvKey = `karrirpath_cv_name_${userEmail}`;
    localStorage.setItem(cvKey, file.name);
  };

  const handleRemove = () => {
    setCvFile(null);
    setCvName('');
    setUploaded(false);
    const cvKey = `karrirpath_cv_name_${userEmail}`;
    localStorage.removeItem(cvKey);
  };

  return (
    <div>
      {uploaded ? (
        <div className={styles.cvUploaded}>
          <div className={styles.cvFileInfo}>
            <div>
              <p className={styles.cvFileName}>{cvName}</p>
              <p className={styles.cvFileStatus}>Terupload</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <label className={styles.cvReplaceBtn}>
              Ganti
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile} style={{ display: 'none' }} />
            </label>
            <button className={styles.itemRemoveBtn} onClick={handleRemove}>Hapus</button>
          </div>
        </div>
      ) : (
        <label className={styles.cvDropzone}>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile} style={{ display: 'none' }} />
          <p className={styles.cvDropTitle}>Upload CV / Resume</p>
          <p className={styles.cvDropSub}>PDF, DOC, atau DOCX · Maks 5MB</p>
        </label>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || 'guest';

  // ── Avatar ──
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  // ── Personal Info ──
  const [editPersonal, setEditPersonal] = useState(false);
  const [savedPersonal, setSavedPersonal] = useState(false);
  const [personal, setPersonal] = useState({
    name: session?.user?.name ?? '',
    email: session?.user?.email ?? '',
    phone: '',
    location: '',
    role: 'Pencari Kerja',
    bio: '',
    portfolio: '',
  });

  const savePersonal = () => {
    setEditPersonal(false);
    setSavedPersonal(true);
    saveToStorage({ personal });
    setTimeout(() => setSavedPersonal(false), 2000);
  };

  // ── Skills ──
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // Load dari localStorage
  useEffect(() => {
    const profileKey = `karrirpath_profile_${userEmail}`;
    const saved = localStorage.getItem(profileKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.skills) setSkills(parsed.skills);
      if (parsed.experiences) setExperiences(parsed.experiences);
      if (parsed.educations) setEducations(parsed.educations);
      if (parsed.personal) setPersonal((prev) => ({ ...prev, ...parsed.personal }));
      if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
    }
  }, [userEmail]);

  // Simpan ke localStorage setiap ada perubahan
  const saveToStorage = (updates: object) => {
    const profileKey = `karrirpath_profile_${userEmail}`;
    const current = JSON.parse(localStorage.getItem(profileKey) || '{}');
    localStorage.setItem(profileKey, JSON.stringify({ ...current, ...updates }));
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      const updated = [...skills, trimmed];
      setSkills(updated);
      saveToStorage({ skills: updated });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    const updated = skills.filter((s) => s !== skill);
    setSkills(updated);
    saveToStorage({ skills: updated });
  };

  // ── Avatar Upload ──
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    saveToStorage({ avatarUrl: url });
  };

  // ── Experience ──
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showExpForm, setShowExpForm] = useState(false);
  const [newExp, setNewExp] = useState({ title: '', company: '', period: '', desc: '' });

  const addExp = () => {
    if (!newExp.title || !newExp.company) return;
    const updated = [...experiences, { id: Date.now().toString(), ...newExp }];
    setExperiences(updated);
    saveToStorage({ experiences: updated });
    setNewExp({ title: '', company: '', period: '', desc: '' });
    setShowExpForm(false);
  };

  const removeExp = (id: string) => {
    const updated = experiences.filter((e) => e.id !== id);
    setExperiences(updated);
    saveToStorage({ experiences: updated });
  };

  // ── Education ──
  const [educations, setEducations] = useState<Education[]>([]);
  const [showEduForm, setShowEduForm] = useState(false);
  const [newEdu, setNewEdu] = useState({ degree: '', school: '', period: '', desc: '' });

  const addEdu = () => {
    if (!newEdu.degree || !newEdu.school) return;
    const updated = [...educations, { id: Date.now().toString(), ...newEdu }];
    setEducations(updated);
    saveToStorage({ educations: updated });
    setNewEdu({ degree: '', school: '', period: '', desc: '' });
    setShowEduForm(false);
  };

  const removeEdu = (id: string) => {
    const updated = educations.filter((e) => e.id !== id);
    setEducations(updated);
    saveToStorage({ educations: updated });
  };

  // Completion score
  const fields = [
    personal.name || session?.user?.name, personal.phone, personal.location, personal.bio,
    personal.portfolio, skills.length > 0 ? 'ok' : '',
    experiences.length > 0 ? 'ok' : '', educations.length > 0 ? 'ok' : '',
  ];
  const filled = fields.filter(Boolean).length;
  const completion = Math.round((filled / fields.length) * 100);

  const avatar = avatarUrl || session?.user?.image;
  const firstName = (personal.name || session?.user?.name || 'U').charAt(0).toUpperCase();

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>

        {/* ── Sidebar ── */}
        <div className={styles.sideCard}>
          <div className={styles.avatarCard}>
            <div className={styles.avatarWrapper}>
              {avatar ? (
                <img src={avatar} alt="avatar" className={styles.avatar} />
              ) : (
                <div className={styles.avatarFallback}>{firstName}</div>
              )}
              <label htmlFor="avatar-upload" className={styles.avatarEditBtn} title="Ganti foto">
                ✏
              </label>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
              />
            </div>
            <h2 className={styles.userName}>{personal.name || session?.user?.name || 'Nama Kamu'}</h2>
            <p className={styles.userRole}>{personal.role}</p>
            <p className={styles.userEmail}>{personal.email || session?.user?.email}</p>

            <div className={styles.completionBar}>
              <div className={styles.completionLabel}>
                <span>Kelengkapan Profil</span>
                <span>{completion}%</span>
              </div>
              <div className={styles.completionTrack}>
                <div className={styles.completionFill} style={{ width: `${completion}%` }} />
              </div>
            </div>
          </div>

          <div className={styles.sideNav}>
            {[
              { icon: '', label: 'Info Personal' },
              { icon: '', label: 'Skills' },
              { icon: '', label: 'Pengalaman' },
              { icon: '', label: 'Pendidikan' },
              { icon: '', label: 'CV / Resume' },
              { icon: '', label: 'Sertifikat' },
            ].map((item) => (
              <button key={item.label} className={styles.sideNavItem}>
                <span className={styles.sideNavIcon}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className={styles.mainContent}>

          {/* Info Personal */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Info Personal</h3>
              {editPersonal ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className={styles.cancelBtn} onClick={() => setEditPersonal(false)}>Batal</button>
                  <button className={styles.saveBtn} onClick={savePersonal}>Simpan</button>
                </div>
              ) : (
                <button className={styles.editBtn} onClick={() => setEditPersonal(true)}>
                  {savedPersonal ? '✓ Tersimpan' : 'Edit'}
                </button>
              )}
            </div>
            <div className={styles.cardBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nama Lengkap</label>
                  <input
                    className={styles.input}
                    value={personal.name || session?.user?.name || ''}
                    disabled={!editPersonal}
                    onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
                    placeholder="Nama lengkap kamu"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email</label>
                  <input
                    className={styles.input}
                    value={personal.email || session?.user?.email || ''}
                    disabled
                    placeholder="Email"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>No. Telepon</label>
                  <input
                    className={styles.input}
                    value={personal.phone}
                    disabled={!editPersonal}
                    onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                    placeholder="+62 812 xxxx xxxx"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Domisili</label>
                  <input
                    className={styles.input}
                    value={personal.location}
                    disabled={!editPersonal}
                    onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
                    placeholder="Jakarta, Indonesia"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Role / Posisi</label>
                  <select
                    className={styles.select}
                    value={personal.role}
                    disabled={!editPersonal}
                    onChange={(e) => setPersonal({ ...personal, role: e.target.value })}
                  >
                    <option>Pencari Kerja</option>
                    <option>Mentor Profesional</option>
                    <option>Tim Recruiter</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Portfolio / Website</label>
                  <input
                    className={styles.input}
                    value={personal.portfolio}
                    disabled={!editPersonal}
                    onChange={(e) => setPersonal({ ...personal, portfolio: e.target.value })}
                    placeholder="https://portfolio.com"
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.label}>Bio / Tentang Saya</label>
                  <textarea
                    className={styles.textarea}
                    value={personal.bio}
                    disabled={!editPersonal}
                    onChange={(e) => setPersonal({ ...personal, bio: e.target.value })}
                    placeholder="Ceritakan sedikit tentang dirimu, pengalaman, dan tujuan karir..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Skills</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.skillsWrap}>
                {skills.map((skill) => (
                  <span key={skill} className={styles.skillTag}>
                    {skill}
                    <button
                      className={styles.skillRemove}
                      onClick={() => removeSkill(skill)}
                      aria-label={`Hapus ${skill}`}
                    >×</button>
                  </span>
                ))}
                {skills.length === 0 && (
                  <p className={styles.staticEmpty}>Belum ada skill. Tambahkan di bawah.</p>
                )}
              </div>
              <div className={styles.skillInput}>
                <input
                  className={styles.skillInputField}
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="Tambah skill (contoh: React, Figma, Python...)"
                />
                <button className={styles.skillAddBtn} onClick={addSkill}>+ Tambah</button>
              </div>
            </div>
          </div>

          {/* Pengalaman */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Pengalaman Kerja</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.itemList}>
                {experiences.map((exp) => (
                  <div key={exp.id} className={styles.item}>
                    <div className={styles.itemHeader}>
                      <div>
                        <h4 className={styles.itemTitle}>{exp.title}</h4>
                        <p className={styles.itemSubtitle}>{exp.company}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={styles.itemPeriod}>{exp.period}</span>
                        <button
                          className={styles.itemRemoveBtn}
                          onClick={() => removeExp(exp.id)}
                        >Hapus</button>
                      </div>
                    </div>
                    {exp.desc && <p className={styles.itemDesc}>{exp.desc}</p>}
                  </div>
                ))}
              </div>

              {showExpForm && (
                <div className={styles.addForm}>
                  <div className={styles.addFormRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Posisi / Jabatan</label>
                      <input className={styles.input} value={newExp.title} onChange={(e) => setNewExp({ ...newExp, title: e.target.value })} placeholder="Frontend Developer" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Perusahaan</label>
                      <input className={styles.input} value={newExp.company} onChange={(e) => setNewExp({ ...newExp, company: e.target.value })} placeholder="PT. Contoh Indonesia" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Periode</label>
                    <input className={styles.input} value={newExp.period} onChange={(e) => setNewExp({ ...newExp, period: e.target.value })} placeholder="Jan 2022 – Des 2023" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Deskripsi</label>
                    <textarea className={styles.textarea} value={newExp.desc} onChange={(e) => setNewExp({ ...newExp, desc: e.target.value })} placeholder="Jelaskan tanggung jawab dan pencapaian kamu..." />
                  </div>
                  <div className={styles.addFormActions}>
                    <button className={styles.cancelBtn} onClick={() => setShowExpForm(false)}>Batal</button>
                    <button className={styles.saveBtn} onClick={addExp}>Simpan</button>
                  </div>
                </div>
              )}

              {!showExpForm && (
                <button className={styles.addItemBtn} onClick={() => setShowExpForm(true)}>
                  + Tambah Pengalaman
                </button>
              )}
            </div>
          </div>

          {/* Pendidikan */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Pendidikan</h3>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.itemList}>
                {educations.map((edu) => (
                  <div key={edu.id} className={styles.item}>
                    <div className={styles.itemHeader}>
                      <div>
                        <h4 className={styles.itemTitle}>{edu.degree}</h4>
                        <p className={styles.itemSubtitle}>{edu.school}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={styles.itemPeriod}>{edu.period}</span>
                        <button
                          className={styles.itemRemoveBtn}
                          onClick={() => removeEdu(edu.id)}
                        >Hapus</button>
                      </div>
                    </div>
                    {edu.desc && <p className={styles.itemDesc}>{edu.desc}</p>}
                  </div>
                ))}
              </div>

              {showEduForm && (
                <div className={styles.addForm}>
                  <div className={styles.addFormRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Gelar / Jurusan</label>
                      <input className={styles.input} value={newEdu.degree} onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })} placeholder="S1 Teknik Informatika" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Institusi</label>
                      <input className={styles.input} value={newEdu.school} onChange={(e) => setNewEdu({ ...newEdu, school: e.target.value })} placeholder="Universitas Indonesia" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Periode</label>
                    <input className={styles.input} value={newEdu.period} onChange={(e) => setNewEdu({ ...newEdu, period: e.target.value })} placeholder="2019 – 2023" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Deskripsi</label>
                    <textarea className={styles.textarea} value={newEdu.desc} onChange={(e) => setNewEdu({ ...newEdu, desc: e.target.value })} placeholder="IPK, prestasi, kegiatan organisasi..." />
                  </div>
                  <div className={styles.addFormActions}>
                    <button className={styles.cancelBtn} onClick={() => setShowEduForm(false)}>Batal</button>
                    <button className={styles.saveBtn} onClick={addEdu}>Simpan</button>
                  </div>
                </div>
              )}

              {!showEduForm && (
                <button className={styles.addItemBtn} onClick={() => setShowEduForm(true)}>
                  + Tambah Pendidikan
                </button>
              )}
            </div>
          </div>

          {/* CV / Resume */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>CV / Resume</h3>
            </div>
            <div className={styles.cardBody}>
              <CvUploadSection />
            </div>
          </div>

          {/* Sertifikat & Spesialisasi */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Sertifikat & Spesialisasi</h3>
            </div>
            <div className={styles.cardBody}>
              <CertSection />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
