const Layout = ({ children }) => {
    return (
        <div className="app-container">
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;
