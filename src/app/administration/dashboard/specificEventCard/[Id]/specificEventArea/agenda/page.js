'use client'
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AgendaApi } from '@/utilities/ApiManager';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import DashboardLoading from '@/app/administration/dashboard/loading';
import SpecificAgendaBlogCard from '@/Component/SpecificEventDetails/Agenda/SpecificAgendaBlogCard';
import AgendaForm from '@/Component/SpecificEventDetails/Agenda/AgendaForm';
import { toast } from 'sonner';
import { FiSearch } from 'react-icons/fi';


export default function Agenda() {
    const { Id } = useParams();
    const [agendas, setAgendas] = useState({ type: "agenda", data: null });
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.menu.loading);

    const fetchAgendas = async () => {
        dispatch(setLoading(true));
        try {
            const res = await AgendaApi(null, "GET", { Id });
            if (res.statusCode === 200 || res.status=== "success") {
                setAgendas({type:"agenda",data:res.data});
                toast.success(res.message || 'Agendas loaded successfully');
            }
        } catch (error) {
            toast.error('Failed to load agendas');
        } finally {
            dispatch(setLoading(false));
        }
    };
    

    const onSuccess = () => {
        alert("hi")

        fetchAgendas();
        setAgendas({type:"agenda",data:null , });
        alert("hi")
    };

    const onClose = () => {
        setAgendas({type:"agenda",data:null});
        fetchAgendas();
    };

    const onEdit=(data)=>{
        setAgendas({type:"edit",data:data});
    }

    const onDelete = () => {
        toast.success('Agenda deleted successfully');
        fetchAgendas();
    };

  

     const getCategories = () => {
        const categories = new Set()
        if (agendas?.data) {
          agendas.data.forEach(item => {
            if (item.category && Array.isArray(item.category)) {
              item.category.forEach(cat => categories.add(cat))
            }
          })
        }
        return Array.from(categories).sort()
      }
     
     let categories = getCategories();
    useEffect(() => {
        fetchAgendas();
    }, [Id]);

    if (isLoading) {
        return <DashboardLoading />;
    }

    return (
        <>
            {!isLoading && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-3 w-full">
                    <div className="flex flex-col sm:flex-row gap-2 flex-1 items-stretch sm:items-center sm:justify-end w-full">
                        <button 
                            onClick={() => setAgendas({type:"open",categories:categories})}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add New Agenda
                        </button>
                    </div>
                    <button 
                        onClick={() => setAgendas({type:"open"})}
                        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center text-2xl z-50"
                        aria-label="Add New Agenda"
                    >
                        +
                    </button>
                </div>
            )}
            {(agendas.type === "open" || agendas.type === "edit") && (
                <AgendaForm 
                    onSuccess={onSuccess} 
                    onClose={onClose}
                    eventId={Id}
                    agendaData={agendas}
                />
            )}
            <SpecificAgendaBlogCard
                onDelete={onDelete}
                onEdit={onEdit}
                agenda={agendas}
            />
        </>
    );
}