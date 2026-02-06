document.addEventListener('DOMContentLoaded', function() {
    // Mettre à jour l'année dans le footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Définir la date d'aujourd'hui comme valeur par défaut
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('lastperiod').value = formattedDate;
    document.getElementById('lastperiod').setAttribute('max', formattedDate);
    
    // Élément de bouton de calcul
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsContainer = document.getElementById('results');
    
    // Éléments d'affichage des résultats
    const nextPeriodDate = document.getElementById('nextPeriodDate');
    const ovulationDate = document.getElementById('ovulationDate');
    const fertilePeriodDate = document.getElementById('fertilePeriodDate');
    const lastPeriodDate = document.getElementById('lastPeriodDate');
    const nextPeriodTimelineDate = document.getElementById('nextPeriodTimelineDate');
    
    // Éléments de la timeline
    const fertilePhase = document.getElementById('fertilePhase');
    const ovulationMarker = document.getElementById('ovulationMarker');
    
    // Fonction de calcul du cycle
    function calculer() {
        let lastperiod = document.getElementById('lastperiod').value;
        let cycleLength = parseInt(document.getElementById('cycleLength').value);
        
        // Validation des entrées
        if (!lastperiod || !cycleLength) {
            showError("Veuillez remplir tous les champs");
            return;
        }
        
        if (cycleLength < 20 || cycleLength > 45) {
            showError("La durée du cycle doit être comprise entre 20 et 45 jours");
            return;
        }
        
        let lastDate = new Date(lastperiod);
        let today = new Date();
        
        // Vérifier que la date n'est pas dans le futur
        if (lastDate > today) {
            showError("La date ne peut pas être dans le futur");
            return;
        }
        
        // Calcul des dates importantes
        // Prochaines règles
        let nextperiod = new Date(lastDate);
        nextperiod.setDate(nextperiod.getDate() + cycleLength);
        
        // Ovulation (14 jours avant les prochaines règles)
        let ovulation = new Date(nextperiod);
        ovulation.setDate(ovulation.getDate() - 14);
        
        // Période fertile (3 jours avant et après l'ovulation)
        let fertileStart = new Date(ovulation);
        fertileStart.setDate(fertileStart.getDate() - 3);
        
        let fertileEnd = new Date(ovulation);
        fertileEnd.setDate(fertileEnd.getDate() + 3);
        
        // Mettre à jour l'affichage des résultats
        updateResults(lastDate, nextperiod, ovulation, fertileStart, fertileEnd, cycleLength);
        
        // Afficher les résultats
        resultsContainer.classList.add('active');
        
        // Faire défiler jusqu'aux résultats
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Fonction pour mettre à jour l'affichage des résultats
    function updateResults(lastDate, nextPeriod, ovulation, fertileStart, fertileEnd, cycleLength) {
        // Formater les dates
        const formatDate = (date) => {
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        };
        
        const formatShortDate = (date) => {
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short'
            });
        };
        
        // Mettre à jour les éléments de texte
        nextPeriodDate.textContent = formatDate(nextPeriod);
        ovulationDate.textContent = formatDate(ovulation);
        fertilePeriodDate.textContent = `${formatDate(fertileStart)} au ${formatDate(fertileEnd)}`;
        lastPeriodDate.textContent = formatShortDate(lastDate);
        nextPeriodTimelineDate.textContent = formatShortDate(nextPeriod);
        
        // Mettre à jour la timeline
        updateTimeline(lastDate, nextPeriod, ovulation, fertileStart, fertileEnd, cycleLength);
        
        // Ajouter des classes pour l'animation
        animateResults();
    }
    
    // Fonction pour mettre à jour la timeline
    function updateTimeline(lastDate, nextPeriod, ovulation, fertileStart, fertileEnd, cycleLength) {
        // Calculer les pourcentages pour la timeline
        const totalDays = cycleLength;
        const fertileStartDay = Math.floor((fertileStart - lastDate) / (1000 * 60 * 60 * 24));
        const fertileEndDay = Math.floor((fertileEnd - lastDate) / (1000 * 60 * 60 * 24));
        const ovulationDay = Math.floor((ovulation - lastDate) / (1000 * 60 * 60 * 24));
        
        // Calculer les positions en pourcentage
        const fertileStartPercent = (fertileStartDay / totalDays) * 100;
        const fertileWidth = ((fertileEndDay - fertileStartDay) / totalDays) * 100;
        const ovulationPercent = (ovulationDay / totalDays) * 100;
        
        // Appliquer les styles à la timeline
        fertilePhase.style.width = `${fertileWidth}%`;
        fertilePhase.style.marginLeft = `${fertileStartPercent}%`;
        
        ovulationMarker.style.left = `${ovulationPercent}%`;
        
        // Ajuster la position du texte si trop proche des bords
        if (ovulationPercent < 10) {
            ovulationMarker.style.transform = 'translateX(0)';
            ovulationMarker.children[0].style.transform = 'translateX(0)';
        } else if (ovulationPercent > 90) {
            ovulationMarker.style.transform = 'translateX(-100%)';
            ovulationMarker.children[0].style.transform = 'translateX(-100%)';
        } else {
            ovulationMarker.style.transform = 'translateX(-50%)';
        }
    }
    
    // Fonction pour animer les résultats
    function animateResults() {
        const resultCards = document.querySelectorAll('.result-card');
        
        resultCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    // Fonction pour afficher les erreurs
    function showError(message) {
        // Créer une alerte stylisée
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert-error';
        alertDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button class="alert-close">&times;</button>
        `;
        
        // Styles pour l'alerte
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f8d7da;
            color: #721c24;
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        // Style pour le bouton de fermeture
        const closeBtn = alertDiv.querySelector('.alert-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: auto;
            color: #721c24;
        `;
        
        // Ajouter l'alerte au document
        document.body.appendChild(alertDiv);
        
        // Fermer l'alerte lors du clic sur le bouton
        closeBtn.addEventListener('click', () => {
            alertDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => alertDiv.remove(), 300);
        });
        
        // Fermer automatiquement après 5 secondes
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => alertDiv.remove(), 300);
            }
        }, 5000);
        
        // Ajouter les animations CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Ajouter l'événement au bouton de calcul
    calculateBtn.addEventListener('click', calculer);
    
    // Ajouter la fonction au scope global pour compatibilité avec onclick
    window.calculer = calculer;
    
    // Permettre le calcul avec la touche Entrée
    document.getElementById('cycleLength').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculer();
        }
    });
    
    document.getElementById('lastperiod').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculer();
        }
    });
});