export const user = async (req, res) => {
    try {
        return res.status(200).json({ ok: true, user: req.user });
    } catch (error) {
        return res.status(500).json({ ok: false, message: "Lỗi hệ thống" });
    }
}
export const profile = async (req, res) => {
    try {
        return res.status(200).json({ ok: true, profile: req.user });
    } catch (error) {
        return res.status(500).json({ ok: false, message: "Lỗi hệ thống" });
    }
}