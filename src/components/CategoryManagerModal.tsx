import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Check, Tag, Sparkles, FolderPlus, ChevronDown, ChevronUp } from 'lucide-react';
import { Category, SubCategory } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { getCategoryTheme } from '../utils/formatters';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
}

const AVAILABLE_COLORS = ['amber', 'blue', 'emerald', 'purple', 'indigo', 'rose'];
const AVAILABLE_ICONS = [
  'Hammer',
  'Users',
  'Sparkles',
  'Armchair',
  'FileText',
  'AlertTriangle',
  'Wrench',
  'Paintbrush',
  'Home',
  'Zap',
  'Droplets',
  'Package',
];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onUpdateCategories,
}) => {
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form states for creating / editing
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('emerald');
  const [catIcon, setCatIcon] = useState('Sparkles');

  // Subcategory states
  const [expandedCatId, setExpandedCatId] = useState<string | null>(categories[0]?.id || null);
  const [newSubcatName, setNewSubcatName] = useState('');
  const [subcatCatId, setSubcatCatId] = useState<string | null>(null);

  if (!isOpen) return null;

  const startCreateNew = () => {
    setIsCreatingNew(true);
    setEditingCatId(null);
    setCatName('');
    setCatColor('emerald');
    setCatIcon('Sparkles');
  };

  const startEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setIsCreatingNew(false);
    setCatName(cat.name);
    setCatColor(cat.color);
    setCatIcon(cat.icon);
  };

  const cancelEdit = () => {
    setEditingCatId(null);
    setIsCreatingNew(false);
    setCatName('');
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (isCreatingNew) {
      const newCat: Category = {
        id: `cat_custom_${Date.now()}`,
        name: catName.trim(),
        color: catColor,
        icon: catIcon,
        subcategories: [],
        isCustom: true,
      };
      onUpdateCategories([...categories, newCat]);
      setExpandedCatId(newCat.id);
    } else if (editingCatId) {
      const updated = categories.map((c) => {
        if (c.id === editingCatId) {
          return {
            ...c,
            name: catName.trim(),
            color: catColor,
            icon: catIcon,
          };
        }
        return c;
      });
      onUpdateCategories(updated);
    }

    cancelEdit();
  };

  const handleDeleteCategory = (catId: string) => {
    if (categories.length <= 1) {
      alert('Você deve manter pelo menos uma categoria.');
      return;
    }
    if (confirm('Tem certeza que deseja remover esta categoria?')) {
      onUpdateCategories(categories.filter((c) => c.id !== catId));
    }
  };

  const handleAddSubcategory = (catId: string) => {
    if (!newSubcatName.trim()) return;
    const newSub: SubCategory = {
      id: `sub_${Date.now()}`,
      name: newSubcatName.trim(),
    };

    const updated = categories.map((c) => {
      if (c.id === catId) {
        return {
          ...c,
          subcategories: [...c.subcategories, newSub],
        };
      }
      return c;
    });

    onUpdateCategories(updated);
    setNewSubcatName('');
    setSubcatCatId(null);
  };

  const handleDeleteSubcategory = (catId: string, subId: string) => {
    const updated = categories.map((c) => {
      if (c.id === catId) {
        return {
          ...c,
          subcategories: c.subcategories.filter((s) => s.id !== subId),
        };
      }
      return c;
    });
    onUpdateCategories(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center">
              <Tag className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 leading-tight">
                Gerenciar Categorias & Subcategorias
              </h3>
              <p className="text-xs text-stone-500">
                Personalize categorias e adicione subcategorias para detalhamento
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Nova Categoria / Editar Categoria Form */}
          {(isCreatingNew || editingCatId) ? (
            <form onSubmit={handleSaveCategory} className="p-4 bg-stone-50 border border-stone-300 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-stone-900">
                  {isCreatingNew ? 'Criar Nova Categoria' : 'Editar Categoria'}
                </h4>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-xs text-stone-500 hover:text-stone-800"
                >
                  Cancelar
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  placeholder="Ex: Instalações Especiais, Paisagismo..."
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Seletor de Cores */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Cor de Identificação
                </label>
                <div className="flex items-center gap-2">
                  {AVAILABLE_COLORS.map((color) => {
                    const theme = getCategoryTheme(color);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setCatColor(color)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-transform cursor-pointer ${
                          catColor === color ? 'border-stone-900 scale-110' : 'border-transparent hover:scale-105'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full ${theme.dot}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seletor de Ícones */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Ícone Representativo
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setCatIcon(icon)}
                      className={`p-2 rounded-xl border text-xs flex items-center justify-center transition-colors cursor-pointer ${
                        catIcon === icon
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <CategoryIcon iconName={icon} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-3 py-1.5 text-xs font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
                >
                  Salvar Categoria
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-between items-center">
              <p className="text-xs text-stone-500">
                {categories.length} categorias cadastradas
              </p>
              <button
                type="button"
                onClick={startCreateNew}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Categoria</span>
              </button>
            </div>
          )}

          {/* Lista de Categorias e Subcategorias */}
          <div className="space-y-3">
            {categories.map((cat) => {
              const theme = getCategoryTheme(cat.color);
              const isExpanded = expandedCatId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-2xs"
                >
                  {/* Category Row */}
                  <div className="p-3.5 flex items-center justify-between bg-stone-50/50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl border ${theme.bg}`}>
                        <CategoryIcon iconName={cat.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">{cat.name}</h4>
                        <span className="text-xs text-stone-500">
                          {cat.subcategories.length} subcategorias
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(cat)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 rounded-lg transition-colors cursor-pointer"
                        title="Editar nome/ícone"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Excluir categoria"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedCatId(isExpanded ? null : cat.id)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 rounded-lg transition-colors cursor-pointer ml-1"
                        title="Ver subcategorias"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Subcategories drawer */}
                  {isExpanded && (
                    <div className="p-4 border-t border-stone-100 bg-white space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                          Subcategorias de {cat.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSubcatCatId(subcatCatId === cat.id ? null : cat.id)}
                          className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Adicionar Subcategoria</span>
                        </button>
                      </div>

                      {/* Input rápido para nova subcategoria */}
                      {subcatCatId === cat.id && (
                        <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200">
                          <input
                            type="text"
                            placeholder="Nome da subcategoria (ex: Piso, Tintas...)"
                            value={newSubcatName}
                            onChange={(e) => setNewSubcatName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddSubcategory(cat.id);
                            }}
                            className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleAddSubcategory(cat.id)}
                            className="px-3 py-1.5 text-xs font-bold bg-emerald-500 text-stone-950 rounded-lg hover:bg-emerald-400 cursor-pointer"
                          >
                            Salvar
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSubcatCatId(null);
                              setNewSubcatName('');
                            }}
                            className="p-1.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Pills das subcategorias */}
                      {cat.subcategories.length === 0 ? (
                        <p className="text-xs text-stone-400 italic">
                          Nenhuma subcategoria cadastrada ainda.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {cat.subcategories.map((sub) => (
                            <span
                              key={sub.id}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-stone-100 text-stone-800 rounded-lg border border-stone-200 group"
                            >
                              <span>{sub.name}</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteSubcategory(cat.id, sub.id)}
                                className="text-stone-400 hover:text-rose-600 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
                                title="Remover subcategoria"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-100 bg-stone-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-stone-800 bg-stone-200 hover:bg-stone-300 rounded-xl transition-colors cursor-pointer"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
