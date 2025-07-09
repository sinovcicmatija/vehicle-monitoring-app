const NotificationModel = ({ type, message }: { type: 'success' | 'error' | 'info', message: string }) => {

    const bgColor = {
        success: 'bg-green',
        error: 'bg-red',
        info: 'bg-yellow',
    }[type];

    return (

        <div className="w-44 rounded-lg shadow-lg flex z-50 m-10">
            <div className={`rounded-lg w-1 h-12 ${bgColor}`}/>
            <div className="flex items-center mx-2 text-sm">{message}</div>
        </div>

    )
};

export default NotificationModel;