if (corrida.status === 'concluída') {
    try {
        const motoboy = await Motoboy.findByPk(corrida.motoboy_id, { 
            include: { model: Carteira } 
        });

        if (motoboy && motoboy.Carteira) {
            const valorCorrida = parseFloat(corrida.valor) || 0;
            const comissao = valorCorrida / 0.10;
            const valorLiquido = Math.max(valorCorrida - comissao, 0); 

            motoboy.Carteira.saldo += valorLiquido;
            await motoboy.Carteira.save();
            
            console.log(`💰 Saldo atualizado para o motoboy ${motoboy.id}: R$${motoboy.Carteira.saldo}`);
        }
    } catch (error) {
        console.error("❌ Erro ao atualizar saldo do motoboy:", error);
    }
}
