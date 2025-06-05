import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { provinces } from '../data/provinceData';
import config from '../config';

interface ProvinceDetails {
  provinceId: string;
  name: string;
  introduction: string;
  famousFor: string[];
  attractions: string[];
  imageUrl?: string;
}

const ProvinceManager: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProvinceDetails>({
    provinceId: '',
    name: '',
    introduction: '',
    famousFor: [''],
    attractions: ['']
  });

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetchProvinceDetails(selectedProvince);
    }
  }, [selectedProvince]);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/users/checkAdmin`, {
        credentials: 'include'
      });
      if (!response.ok) {
        setIsAdmin(false);
        navigate('/');
      } else {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error('Admin check failed:', err);
      navigate('/');
    }
  };

  const fetchProvinceDetails = async (provinceId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_URL}/api/provinces/${provinceId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setFormData({
          provinceId: data.id || data.provinceId, // handle both id formats
          name: data.name,
          introduction: data.introduction || '',
          famousFor: data.famousFor?.length ? data.famousFor : [''],
          attractions: data.attractions?.length ? data.attractions : [''],
          imageUrl: data.imageUrl
        });
        setError('');
      } else if (response.status === 404) {
        // If province not found in database, use data from provinceData.ts
        const province = provinces.find(p => p.id === provinceId);
        if (province) {
          setFormData({
            provinceId: province.id,
            name: province.name,
            introduction: '',
            famousFor: [''],
            attractions: ['']
          });
          setError('');
        } else {
          setError('Province not found');
        }
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to fetch province details');
      }
    } catch (err) {
      console.error('Error fetching province:', err);
      setError('Failed to fetch province details');
    } finally {
      setLoading(false);
    }
  };

  const handleProvinceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const province = provinces.find(p => p.id === e.target.value);
    if (province) {
      setSelectedProvince(province.id);
      setFormData(prev => ({
        ...prev,
        provinceId: province.id,
        name: province.name,
      }));
    }
  };

  const handleFamousForChange = (index: number, value: string) => {
    setFormData(prev => {
      const newFamousFor = [...prev.famousFor];
      newFamousFor[index] = value;
      return { ...prev, famousFor: newFamousFor };
    });
  };

  const handleAttractionChange = (index: number, value: string) => {
    setFormData(prev => {
      const newAttractions = [...prev.attractions];
      newAttractions[index] = value;
      return { ...prev, attractions: newAttractions };
    });
  };

  const handleRemoveFamousFor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      famousFor: prev.famousFor.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveAttraction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attractions: prev.attractions.filter((_, i) => i !== index)
    }));
  };

  const handleAddFamousFor = () => {
    setFormData(prev => ({
      ...prev,
      famousFor: [...prev.famousFor, '']
    }));
  };

  const handleAddAttraction = () => {
    setFormData(prev => ({
      ...prev,
      attractions: [...prev.attractions, '']
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.provinceId) {
      setError('Please select a province');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Convert provinceId to id for backend consistency
      formDataToSend.append('id', formData.provinceId);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('introduction', formData.introduction);
      formDataToSend.append('famousFor', JSON.stringify(formData.famousFor.filter(Boolean)));
      formDataToSend.append('attractions', JSON.stringify(formData.attractions.filter(Boolean)));

      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      const method = selectedProvince ? 'PUT' : 'POST';
      const url = selectedProvince 
        ? `${config.API_URL}/api/provinces/${selectedProvince}`
        : `${config.API_URL}/api/provinces`;

      const response = await fetch(url, {
        method,
        credentials: 'include',
        body: formDataToSend
      });

      if (response.ok) {
        alert('Province details saved successfully!');
        // Refresh the province details
        if (selectedProvince) {
          await fetchProvinceDetails(selectedProvince);
        } else {
          setFormData({
            provinceId: '',
            name: '',
            introduction: '',
            famousFor: [''],
            attractions: ['']
          });
          setSelectedFile(null);
          setSelectedProvince('');
        }
        setError('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to save province details');
      }
    } catch (err) {
      console.error('Error saving province:', err);
      setError('Failed to save province details');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-cyan-500 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Province Management</h2>
        
        {error && <div className="mb-4 text-red-500 p-3 bg-red-100 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Select Province:</label>
            <select
              value={selectedProvince}
              onChange={handleProvinceSelect}
              className="w-full p-2 border rounded-lg"
              required
              disabled={loading}
            >
              <option value="">Choose a province</option>
              {provinces.map(province => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div>
                <label className="block mb-2 font-medium">Introduction:</label>
                <textarea
                  value={formData.introduction}
                  onChange={e => setFormData(prev => ({ ...prev, introduction: e.target.value }))}
                  className="w-full p-2 border rounded-lg min-h-[100px]"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Famous For:</label>
                {formData.famousFor.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={e => handleFamousForChange(index, e.target.value)}
                      className="flex-1 p-2 border rounded-lg"
                      placeholder="Enter a famous feature"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFamousFor(index)}
                      className="bg-red-500 text-white px-4 rounded-lg hover:bg-red-600"
                      disabled={formData.famousFor.length === 1}
                    >
                      -
                    </button>
                    {index === formData.famousFor.length - 1 && (
                      <button
                        type="button"
                        onClick={handleAddFamousFor}
                        className="bg-green-500 text-white px-4 rounded-lg hover:bg-green-600"
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block mb-2 font-medium">Attractions:</label>
                {formData.attractions.map((attraction, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={attraction}
                      onChange={e => handleAttractionChange(index, e.target.value)}
                      className="flex-1 p-2 border rounded-lg"
                      placeholder="Enter an attraction"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAttraction(index)}
                      className="bg-red-500 text-white px-4 rounded-lg hover:bg-red-600"
                      disabled={formData.attractions.length === 1}
                    >
                      -
                    </button>
                    {index === formData.attractions.length - 1 && (
                      <button
                        type="button"
                        onClick={handleAddAttraction}
                        className="bg-green-500 text-white px-4 rounded-lg hover:bg-green-600"
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block mb-2 font-medium">Province Image:</label>
                {formData.imageUrl && (
                  <div className="mb-2">
                    <img 
                      src={formData.imageUrl} 
                      alt={formData.name} 
                      className="max-w-xs rounded-lg shadow-md"
                    />
                  </div>
                )}
                <input
                  type="file"
                  onChange={e => e.target.files && setSelectedFile(e.target.files[0])}
                  className="w-full p-2 border rounded-lg"
                  accept="image/*"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : `${selectedProvince ? 'Update' : 'Save'} Province Details`}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProvinceManager;
