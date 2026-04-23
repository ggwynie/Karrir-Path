"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from './mentorship.module.css';

interface MentorProfile {
  fullName: string;
  title: string;
  company: string;
  yearsExperience: number;
  category: string;
  bio: string;
  expertise: string[];
  hourlyRate: string;
  profilePhoto: File | null;
  profilePhotoUrl: string;
  cv: File | null;
  cvUrl: string;
  certifications: {
    name: string;
    issuer: string;
    year: string;
    url: string;
  }[];
  projects: {
    title: string;
    description: string;
    link: string;
    year: string;
  }[];
  socialLinks: {
    linkedin: string;
    github: string;
    portfolio: string;
    twitter: string;
  };
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  languages: string[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
}

interface Props {
  profile: MentorProfile;
  onUpdate: (profile: MentorProfile) => void;
  onBack: () => void;
}

export default function MentorDashboard({ profile, onUpdate, onBack }: Props) {
  const { data: session, update: updateSession } = useSession();
  
  // Auto enable edit mode if profile is empty (new mentor)
  const isNewMentor = !profile.fullName || profile.fullName === '';
  const [editMode, setEditMode] = useState(isNewMentor);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const isProfileComplete = (p: MentorProfile) =>
    p.fullName.trim() !== '' &&
    p.title.trim() !== '' &&
    p.company.trim() !== '' &&
    p.yearsExperience > 0 &&
    p.bio.trim() !== '' &&
    p.expertise.length > 0 &&
    p.hourlyRate.trim() !== '';

  const [localProfile, setLocalProfile] = useState<MentorProfile>(profile);
  const [expertiseInput, setExpertiseInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');

  // Load profile from DB on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/mentor/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            const merged: MentorProfile = {
              fullName: data.profile.fullName || '',
              title: data.profile.title || '',
              company: data.profile.company || '',
              yearsExperience: data.profile.yearsExperience || 0,
              category: data.profile.category || 'Tech',
              bio: data.profile.bio || '',
              expertise: data.profile.expertise || [],
              hourlyRate: data.profile.hourlyRate || '',
              profilePhoto: null,
              profilePhotoUrl: data.profile.profilePhotoUrl || '',
              cv: null,
              cvUrl: data.profile.cvUrl || '',
              certifications: data.profile.certifications || [],
              projects: data.profile.projects || [],
              socialLinks: data.profile.socialLinks || { linkedin: '', github: '', portfolio: '', twitter: '' },
              availability: data.profile.availability || { monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false },
              languages: data.profile.languages || [],
              education: data.profile.education || [],
            };
            setLocalProfile(merged);
            onUpdate(merged);
            setEditMode(false);
          } else {
            setEditMode(true);
          }
        }
      } catch (e) {
        console.error('Failed to load profile', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!isProfileComplete(localProfile)) return;
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/mentor/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localProfile),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || 'Gagal menyimpan profil');
        return;
      }
      await updateSession({ role: 'mentor' });
      onUpdate(localProfile);
      setEditMode(false);
    } catch (e) {
      setSaveError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalProfile({ ...localProfile, profilePhoto: file, profilePhotoUrl: url });
    }
  };

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalProfile({ ...localProfile, cv: file, cvUrl: url });
    }
  };

  const addExpertise = () => {
    if (expertiseInput.trim() && !localProfile.expertise.includes(expertiseInput.trim())) {
      setLocalProfile({
        ...localProfile,
        expertise: [...localProfile.expertise, expertiseInput.trim()],
      });
      setExpertiseInput('');
    }
  };

  const removeExpertise = (item: string) => {
    setLocalProfile({
      ...localProfile,
      expertise: localProfile.expertise.filter((e) => e !== item),
    });
  };

  const addLanguage = () => {
    if (languageInput.trim() && !localProfile.languages.includes(languageInput.trim())) {
      setLocalProfile({
        ...localProfile,
        languages: [...localProfile.languages, languageInput.trim()],
      });
      setLanguageInput('');
    }
  };

  const removeLanguage = (item: string) => {
    setLocalProfile({
      ...localProfile,
      languages: localProfile.languages.filter((l) => l !== item),
    });
  };

  const addCertification = () => {
    setLocalProfile({
      ...localProfile,
      certifications: [
        ...localProfile.certifications,
        { name: '', issuer: '', year: '', url: '' },
      ],
    });
  };

  const updateCertification = (index: number, field: string, value: string) => {
    const updated = [...localProfile.certifications];
    updated[index] = { ...updated[index], [field]: value };
    setLocalProfile({ ...localProfile, certifications: updated });
  };

  const removeCertification = (index: number) => {
    setLocalProfile({
      ...localProfile,
      certifications: localProfile.certifications.filter((_, i) => i !== index),
    });
  };

  const addProject = () => {
    setLocalProfile({
      ...localProfile,
      projects: [
        ...localProfile.projects,
        { title: '', description: '', link: '', year: '' },
      ],
    });
  };

  const updateProject = (index: number, field: string, value: string) => {
    const updated = [...localProfile.projects];
    updated[index] = { ...updated[index], [field]: value };
    setLocalProfile({ ...localProfile, projects: updated });
  };

  const removeProject = (index: number) => {
    setLocalProfile({
      ...localProfile,
      projects: localProfile.projects.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    setLocalProfile({
      ...localProfile,
      education: [
        ...localProfile.education,
        { degree: '', institution: '', year: '' },
      ],
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...localProfile.education];
    updated[index] = { ...updated[index], [field]: value };
    setLocalProfile({ ...localProfile, education: updated });
  };

  const removeEducation = (index: number) => {
    setLocalProfile({
      ...localProfile,
      education: localProfile.education.filter((_, i) => i !== index),
    });
  };

  return (
    <div className={styles.mentorDashboard} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'auto', zIndex: 9999, backgroundColor: '#f4f4f2' }}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <button className={styles.backBtn} onClick={onBack}>
          ← Kembali ke Browse
        </button>
        <h1 className={styles.dashboardTitle}>Profil Mentor</h1>
        {!editMode ? (
          <button className={styles.editBtn} onClick={() => setEditMode(true)}>
            Edit Profil
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className={styles.cancelBtn} onClick={() => {
              setLocalProfile(profile);
              setEditMode(false);
            }}>
              Batal
            </button>
            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={!isProfileComplete(localProfile) || saving}
              title={!isProfileComplete(localProfile) ? 'Lengkapi semua field wajib (*) terlebih dahulu' : ''}
              style={!isProfileComplete(localProfile) || saving ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              {saving ? 'Menyimpan...' : 'Simpan & Daftar'}
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: '#888' }}>Memuat profil...</div>
      ) : (
      <div className={styles.dashboardBody}>
        {/* Completion indicator */}
        {editMode && (
          <div style={{
            padding: '12px 16px',
            marginBottom: 16,
            background: isProfileComplete(localProfile) ? '#e6f9f0' : '#fff8e1',
            border: `1px solid ${isProfileComplete(localProfile) ? '#34c77b' : '#f5c842'}`,
            borderRadius: 8,
            fontSize: 13,
            color: isProfileComplete(localProfile) ? '#1a7a4a' : '#7a5c00',
          }}>
            {isProfileComplete(localProfile)
              ? 'Profil sudah lengkap. Kamu bisa menyimpan dan mendaftar sebagai mentor.'
              : 'Lengkapi field wajib (*): Nama, Jabatan, Perusahaan, Pengalaman, Bio, Keahlian, dan Tarif per Jam.'}
          </div>
        )}
        {saveError && (
          <div style={{ padding: '12px 16px', marginBottom: 16, background: '#fee2e2', border: '1px solid #dc2626', borderRadius: 8, fontSize: 13, color: '#dc2626' }}>
            {saveError}
          </div>
        )}
        {/* Profile Photo */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Foto Profil</h2>
          <div className={styles.photoUploadArea}>
            {localProfile.profilePhotoUrl ? (
              <div className={styles.photoPreview}>
                <img src={localProfile.profilePhotoUrl} alt="Profile" className={styles.photoImg} />
                {editMode && (
                  <label htmlFor="photo-upload" className={styles.photoChangeBtn}>
                    Ganti Foto
                  </label>
                )}
              </div>
            ) : (
              <label htmlFor="photo-upload" className={styles.photoPlaceholder} style={{ cursor: editMode ? 'pointer' : 'default' }}>
                <div className={styles.photoPlaceholderIcon}>📷</div>
                {editMode ? (
                  <span className={styles.photoPlaceholderText}>Klik untuk upload foto</span>
                ) : (
                  <p className={styles.emptyText}>Belum ada foto profil</p>
                )}
              </label>
            )}
            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className={styles.fileInput}
                id="photo-upload"
              />
            )}
          </div>
          <p className={styles.photoHint}>Foto profil akan ditampilkan di kartu mentor kamu. Ukuran maksimal 5MB.</p>
        </div>

        {/* Basic Info */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Informasi Dasar</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nama Lengkap *</label>
              <input
                type="text"
                className={styles.formInput}
                value={localProfile.fullName}
                onChange={(e) => setLocalProfile({ ...localProfile, fullName: e.target.value })}
                disabled={!editMode}
                placeholder="Nama lengkap kamu"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Jabatan/Title *</label>
              <input
                type="text"
                className={styles.formInput}
                value={localProfile.title}
                onChange={(e) => setLocalProfile({ ...localProfile, title: e.target.value })}
                disabled={!editMode}
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Perusahaan *</label>
              <input
                type="text"
                className={styles.formInput}
                value={localProfile.company}
                onChange={(e) => setLocalProfile({ ...localProfile, company: e.target.value })}
                disabled={!editMode}
                placeholder="Perusahaan tempat bekerja"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Pengalaman (Tahun) *</label>
              <input
                type="number"
                className={styles.formInput}
                value={localProfile.yearsExperience}
                onChange={(e) => setLocalProfile({ ...localProfile, yearsExperience: parseInt(e.target.value) || 0 })}
                disabled={!editMode}
                placeholder="Berapa tahun pengalaman"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Kategori *</label>
              <select
                className={styles.formInput}
                value={localProfile.category}
                onChange={(e) => setLocalProfile({ ...localProfile, category: e.target.value })}
                disabled={!editMode}
              >
                <option value="Tech">Tech</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Data">Data</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tarif per Jam *</label>
              <input
                type="text"
                className={styles.formInput}
                value={localProfile.hourlyRate}
                onChange={(e) => setLocalProfile({ ...localProfile, hourlyRate: e.target.value })}
                disabled={!editMode}
                placeholder="e.g. Rp 150.000"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Bio / Deskripsi *</label>
            <textarea
              className={styles.formTextarea}
              value={localProfile.bio}
              onChange={(e) => setLocalProfile({ ...localProfile, bio: e.target.value })}
              disabled={!editMode}
              placeholder="Ceritakan tentang pengalaman dan keahlian kamu..."
              rows={4}
            />
          </div>
        </div>

        {/* CV Upload */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>CV / Resume</h2>
          {editMode ? (
            <div className={styles.uploadArea}>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCVUpload}
                className={styles.fileInput}
                id="cv-upload"
              />
              <label htmlFor="cv-upload" className={styles.uploadLabel}>
                {localProfile.cvUrl ? '✓ CV Terupload' : 'Upload CV (PDF, DOC, DOCX)'}
              </label>
              {localProfile.cvUrl && (
                <a href={localProfile.cvUrl} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
                  Lihat CV
                </a>
              )}
            </div>
          ) : (
            <div>
              {localProfile.cvUrl ? (
                <a href={localProfile.cvUrl} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
                  Lihat CV
                </a>
              ) : (
                <p className={styles.emptyText}>Belum ada CV terupload</p>
              )}
            </div>
          )}
        </div>

        {/* Expertise */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Keahlian</h2>
          {editMode && (
            <div className={styles.addRow}>
              <input
                type="text"
                className={styles.formInput}
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addExpertise()}
                placeholder="Tambah keahlian (e.g. React, Python)"
              />
              <button className={styles.addBtn} onClick={addExpertise}>
                + Tambah
              </button>
            </div>
          )}
          <div className={styles.tagList}>
            {localProfile.expertise.map((item) => (
              <div key={item} className={styles.tag}>
                {item}
                {editMode && (
                  <button className={styles.tagRemove} onClick={() => removeExpertise(item)}>
                    ✕
                  </button>
                )}
              </div>
            ))}
            {localProfile.expertise.length === 0 && (
              <p className={styles.emptyText}>Belum ada keahlian ditambahkan</p>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Sertifikasi</h2>
          {editMode && (
            <button className={styles.addBtn} onClick={addCertification}>
              + Tambah Sertifikasi
            </button>
          )}
          <div className={styles.itemList}>
            {localProfile.certifications.map((cert, idx) => (
              <div key={idx} className={styles.itemCard}>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={cert.name}
                      onChange={(e) => updateCertification(idx, 'name', e.target.value)}
                      placeholder="Nama Sertifikat"
                    />
                    <input
                      type="text"
                      className={styles.formInput}
                      value={cert.issuer}
                      onChange={(e) => updateCertification(idx, 'issuer', e.target.value)}
                      placeholder="Penerbit"
                    />
                    <input
                      type="text"
                      className={styles.formInput}
                      value={cert.year}
                      onChange={(e) => updateCertification(idx, 'year', e.target.value)}
                      placeholder="Tahun"
                    />
                    <input
                      type="url"
                      className={styles.formInput}
                      value={cert.url}
                      onChange={(e) => updateCertification(idx, 'url', e.target.value)}
                      placeholder="URL Sertifikat (opsional)"
                    />
                    <button className={styles.removeBtn} onClick={() => removeCertification(idx)}>
                      Hapus
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className={styles.itemTitle}>{cert.name || 'Nama Sertifikat'}</h3>
                    <p className={styles.itemSub}>{cert.issuer} • {cert.year}</p>
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className={styles.itemLink}>
                        Lihat Sertifikat →
                      </a>
                    )}
                  </>
                )}
              </div>
            ))}
            {localProfile.certifications.length === 0 && (
              <p className={styles.emptyText}>Belum ada sertifikasi ditambahkan</p>
            )}
          </div>
        </div>

        {/* Projects */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Portfolio / Projects</h2>
          {editMode && (
            <button className={styles.addBtn} onClick={addProject}>
              + Tambah Project
            </button>
          )}
          <div className={styles.itemList}>
            {localProfile.projects.map((proj, idx) => (
              <div key={idx} className={styles.itemCard}>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={proj.title}
                      onChange={(e) => updateProject(idx, 'title', e.target.value)}
                      placeholder="Judul Project"
                    />
                    <textarea
                      className={styles.formTextarea}
                      value={proj.description}
                      onChange={(e) => updateProject(idx, 'description', e.target.value)}
                      placeholder="Deskripsi project"
                      rows={2}
                    />
                    <input
                      type="url"
                      className={styles.formInput}
                      value={proj.link}
                      onChange={(e) => updateProject(idx, 'link', e.target.value)}
                      placeholder="Link project"
                    />
                    <input
                      type="text"
                      className={styles.formInput}
                      value={proj.year}
                      onChange={(e) => updateProject(idx, 'year', e.target.value)}
                      placeholder="Tahun"
                    />
                    <button className={styles.removeBtn} onClick={() => removeProject(idx)}>
                      Hapus
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className={styles.itemTitle}>{proj.title || 'Judul Project'}</h3>
                    <p className={styles.itemText}>{proj.description}</p>
                    <p className={styles.itemSub}>{proj.year}</p>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className={styles.itemLink}>
                        Lihat Project →
                      </a>
                    )}
                  </>
                )}
              </div>
            ))}
            {localProfile.projects.length === 0 && (
              <p className={styles.emptyText}>Belum ada project ditambahkan</p>
            )}
          </div>
        </div>

        {/* Education */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Pendidikan</h2>
          {editMode && (
            <button className={styles.addBtn} onClick={addEducation}>
              + Tambah Pendidikan
            </button>
          )}
          <div className={styles.itemList}>
            {localProfile.education.map((edu, idx) => (
              <div key={idx} className={styles.itemCard}>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={edu.degree}
                      onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                      placeholder="Gelar / Jurusan"
                    />
                    <input
                      type="text"
                      className={styles.formInput}
                      value={edu.institution}
                      onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                      placeholder="Institusi / Universitas"
                    />
                    <input
                      type="text"
                      className={styles.formInput}
                      value={edu.year}
                      onChange={(e) => updateEducation(idx, 'year', e.target.value)}
                      placeholder="Tahun Lulus"
                    />
                    <button className={styles.removeBtn} onClick={() => removeEducation(idx)}>
                      Hapus
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className={styles.itemTitle}>{edu.degree || 'Gelar'}</h3>
                    <p className={styles.itemSub}>{edu.institution} • {edu.year}</p>
                  </>
                )}
              </div>
            ))}
            {localProfile.education.length === 0 && (
              <p className={styles.emptyText}>Belum ada pendidikan ditambahkan</p>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Social Links</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>LinkedIn</label>
              <input
                type="url"
                className={styles.formInput}
                value={localProfile.socialLinks.linkedin}
                onChange={(e) => setLocalProfile({
                  ...localProfile,
                  socialLinks: { ...localProfile.socialLinks, linkedin: e.target.value },
                })}
                disabled={!editMode}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>GitHub</label>
              <input
                type="url"
                className={styles.formInput}
                value={localProfile.socialLinks.github}
                onChange={(e) => setLocalProfile({
                  ...localProfile,
                  socialLinks: { ...localProfile.socialLinks, github: e.target.value },
                })}
                disabled={!editMode}
                placeholder="https://github.com/username"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Portfolio</label>
              <input
                type="url"
                className={styles.formInput}
                value={localProfile.socialLinks.portfolio}
                onChange={(e) => setLocalProfile({
                  ...localProfile,
                  socialLinks: { ...localProfile.socialLinks, portfolio: e.target.value },
                })}
                disabled={!editMode}
                placeholder="https://yourportfolio.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Twitter</label>
              <input
                type="url"
                className={styles.formInput}
                value={localProfile.socialLinks.twitter}
                onChange={(e) => setLocalProfile({
                  ...localProfile,
                  socialLinks: { ...localProfile.socialLinks, twitter: e.target.value },
                })}
                disabled={!editMode}
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Bahasa</h2>
          {editMode && (
            <div className={styles.addRow}>
              <input
                type="text"
                className={styles.formInput}
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addLanguage()}
                placeholder="Tambah bahasa (e.g. Indonesia, English)"
              />
              <button className={styles.addBtn} onClick={addLanguage}>
                + Tambah
              </button>
            </div>
          )}
          <div className={styles.tagList}>
            {localProfile.languages.map((item) => (
              <div key={item} className={styles.tag}>
                {item}
                {editMode && (
                  <button className={styles.tagRemove} onClick={() => removeLanguage(item)}>
                    ✕
                  </button>
                )}
              </div>
            ))}
            {localProfile.languages.length === 0 && (
              <p className={styles.emptyText}>Belum ada bahasa ditambahkan</p>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Ketersediaan</h2>
          <div className={styles.availabilityGrid}>
            {Object.keys(localProfile.availability).map((day) => (
              <label key={day} className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={localProfile.availability[day as keyof typeof localProfile.availability]}
                  onChange={(e) => setLocalProfile({
                    ...localProfile,
                    availability: {
                      ...localProfile.availability,
                      [day]: e.target.checked,
                    },
                  })}
                  disabled={!editMode}
                />
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </div>
      )} {/* end loading conditional */}
    </div>
  );
}
